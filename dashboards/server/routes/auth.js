const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }
  );
};

router.post('/register', async (req, res) => {
  const { email, password, role, department} = req.body;
  console.log(req.body)
  if (!email || !password || !role) return res.status(400).json({ error: 'All fields required' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
        'INSERT INTO users (email, password, role, department) VALUES ($1, $2, $3, $4)',
        [email, hashed, role, department]
    );
    res.status(201).json({ success: true, message: 'User registered' });
} catch (err) {
    console.error(err);
    
    // Specific error messages
    let errorMessage = 'Registration failed';
    if (err.code === '23505') { // Unique violation (duplicate email)
        errorMessage = 'Email already exists';
    } else if (err.code === '23502') { // Not null violation
        errorMessage = 'Missing required fields';
    }

    res.status(400).json({ 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
}
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
   const [rows] = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows;

if (!user || !(await bcrypt.compare(password, user.password))) {
  return res.status(401).json({ error: 'Invalid credentials' });
}

const token = generateToken({ id: user.email, role: user.role }); // this is important
res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'None',
  maxAge: 60 * 60 * 1000, // 1 hour
});

res.json({ role: user.role });
;  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(203);
});


router.get('/check', authenticateToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  console.log(req.user)
  res.json({ role: req.user.role });  // ✅ Important: send something back
});

router.get('/classrooms', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM classrooms');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/attendance/mark', authenticateToken, authorizeRole('student'), async (req, res) => {
  const { classroomId, latitude, longitude } = req.body;
  const studentId = req.user.id;

  try {
    // Get classroom geofence
    const [rows] = await pool.query('SELECT * FROM classrooms WHERE id = ?', [classroomId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Classroom not found' });

    const classroom = rows[0];

    // Calculate distance between student location and classroom center
    const distance = getDistanceFromLatLonInMeters(latitude, longitude, classroom.latitude, classroom.longitude);

    if (distance > classroom.radius) {
      return res.status(403).json({ error: 'You are outside the classroom geofence' });
    }

    // Insert attendance record
    await pool.query('INSERT INTO attendance (student_id, classroom_id) VALUES (?, ?)', [studentId, classroomId]);

    res.json({ message: 'Attendance marked successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function to calculate distance between two lat/lon points (Haversine formula)
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

router.get('/attendance/:classroomId', authenticateToken, async (req, res) => {
  const classroomId = req.params.classroomId;

  // block students from viewing attendance list
  if (req.user.role === 'student') return res.status(403).json({ error: 'Forbidden' });

  try {
    const [rows] = await pool.query(
      `SELECT a.id, u.email AS studentEmail, a.timestamp
       FROM attendance a
       JOIN users u ON a.student_id = u.id
       WHERE a.classroom_id = ?`,
      [classroomId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
