const express = require('express');
const router = express.Router();
const pool = require('../db');
const {authenticateToken} = require('../middleware/auth')

// GET all classrooms
router.get('/', authenticateToken, async (req, res) => {
  const user = req.user;

  if (user.role !== 'student') {
    return res.status(403).json({ error: 'Only students can access classroom list' });
  }

  try {
    const [rows] = await pool.query(
  `SELECT * FROM classrooms 
   WHERE is_active = true AND id NOT IN (
     SELECT classroom_id FROM attendance WHERE student_id = $1
   )`,
  [user.id]
);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch classroom list' });
  }
});


router.get('/all', authenticateToken, async (req, res) => {
  const user = req.user;
  if (user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM classrooms');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch classrooms' });
  }
});


router.patch('/:id/start', authenticateToken, async (req, res) => {
  const { latitude, longitude, radius } = req.body;
  const { id } = req.params;
  const user = req.user;

  if (user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    await pool.query(
      `UPDATE classrooms SET is_active = true, latitude = $1, longitude = $2, radius = $3 WHERE id = $4`,
      [latitude, longitude, radius || 100, id]
    );
    res.json({ message: 'Classroom attendance started' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to start classroom' });
  }
});


router.patch('/:id/stop', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  if (user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    await pool.query(`UPDATE classrooms SET is_active = false WHERE id = $1`, [id]);
    res.json({ message: 'Classroom attendance stopped' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to stop classroom' });
  }
});



module.exports = router;
