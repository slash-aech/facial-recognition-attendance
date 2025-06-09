const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all classrooms
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM classrooms');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch classrooms' });
  }
});

module.exports = router;
