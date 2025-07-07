const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/dbconfig');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const dotenv = require('dotenv')
dotenv.config();

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
  console.log(req.body)
  const { email, password } = req.body;

  try {
  const result = await pool.query('SELECT * FROM user_authentication WHERE email_id = $1', [email]);
  const user = result.rows[0]; // Extract first object
  if (!user || !(await bcrypt.compare(password, user.password))) {
  return console.log("Invalid credentials"), res.status(401).json({ error: 'Invalid credentials' });
}

const infoRows = await pool.query('SELECT * FROM user_info WHERE id = $1', [user.user_info_id]);
  if(!infoRows){
  return res.status(401).json({ error: 'couldnt find extra info' });
}
const userInfo = infoRows.rows[0]; // Extract first object

const token = generateToken({ id: user.email_id, role: userInfo.user_role });

res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'None',
  maxAge: 60 * 60 * 1000, // 1 hour
});
res.cookie('institute_id', userInfo.institute_id, {
  httpOnly: false, // frontend needs access
  secure: true,
  sameSite: 'None',
  maxAge: 60 * 60 * 1000,
});
res.cookie('department_id', userInfo.department_id, {
  httpOnly: false,
  secure: true,
  sameSite: 'None',
  maxAge: 60 * 60 * 1000,
});
res.json({
  role: userInfo.user_role,
  email_id: user.email_id,
  user_id: userInfo.user_id, // or userInfo.id if needed
  full_name: userInfo.full_name,
});
;  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});



router.post('/logout', async (req, res) => {
res.clearCookie('token', {
  httpOnly: true,
  secure: true,
  sameSite: 'None'
})
res.status(200).json({ message: 'Logged out successfully' });
});



router.get('/check', authenticateToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  console.log(req.user)
  res.json({ role: req.user.role });  // ✅ Important: send something back
});




module.exports = router;
