const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all classrooms
router.get('/', async (req, res) => {
  try {
    const [data] = await pool.query('SELECT * FROM classrooms');
    console.log(res.json(data));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch classrooms' });
  }
});

module.exports = router;
