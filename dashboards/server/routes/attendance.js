const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');


function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}



// POST /api/attendance/mark
router.post('/mark', authenticateToken, async (req, res) => {
  const { classroom_id, latitude, longitude } = req.body;
  const user = req.user;
  // console.log("This is user \n", user);

  if (user.role !== 'student') {
    return res.status(403).json({ error: 'Only students can mark attendance' });
  }

  try {
    const [classroomRows] = await pool.query('SELECT latitude, longitude, radius FROM classrooms WHERE id = $1 AND is_active = true', [classroom_id]);
    if (classroomRows.length === 0) {
      return res.status(400)  .json({ error: 'Attendance not active or invalid classroom' });
    }
    const { latitude: cLat, longitude: cLng, radius } = classroomRows;

    const distance = getDistanceFromLatLonInMeters(cLat, cLng, latitude, longitude);
    if (distance > radius) {
      return res.status(400).json({ error: 'You are not within allowed range to mark attendance' });
    }
    await pool.query(
      'INSERT INTO attendance (student_id, classroom_id, latitude, longitude, timestamp) VALUES ($1, $2, $3, $4, NOW())',
      [user.id, classroom_id, latitude, longitude]
    );  
    res.json({ message: 'Attendance marked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// GET /api/attendance/records?classroom_id=1
router.get('/records', authenticateToken, async (req, res) => {
  const user = req.user;
  const classroomId = req.query.classroom_id;

  if (user.role === 'student') {
    return res.status(403).json({ error: 'Students are not allowed to view attendance records' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT a.id, u.email, a.timestamp, a.latitude, a.longitude
       FROM attendance a
       JOIN users u ON a.student_id = u.id
       WHERE a.classroom_id = ?`,
      [classroomId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

module.exports = router;