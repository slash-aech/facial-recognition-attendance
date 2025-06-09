const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// POST /api/attendance/mark
router.post('/mark', authenticateToken, async (req, res) => {
  const { classroom_id, latitude, longitude } = req.body;
  console.log('MARK request body:', req.body);
  const user = req.user;
  console.log('User from token:', user);


  if (user.role !== 'student') {
    return res.status(403).json({ error: 'Only students can mark attendance' });
  }

  try {
    const [[userRow]] = await pool.query('SELECT email FROM users WHERE id = ?', [user.id]);
    const studentEmail = userRow.student_email;

    await pool.query('INSERT INTO attendance (student_id, classroom_id, latitude, longitude, student_email) VALUES (?, ?, ?, ?, ?)',
    [user.id, classroom_id, latitude, longitude, studentEmail]
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