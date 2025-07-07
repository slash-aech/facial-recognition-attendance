const express = require('express');
const router = express.Router();
const db = require('../config/dbconfig');

// Helper to check if a string is UUID
const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

router.get('/', async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  try {
    const result = await db.query(`SELECT * FROM user_info WHERE user_id = $1`, [user_id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const data = result.rows[0];

    // Filter out UUIDs and nulls
    const filtered = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) =>
          value !== null && !(typeof value === 'string' && isUUID(value))
      )
    );

    res.json(filtered);
  } catch (err) {
    console.error('❌ Error fetching student profile:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
