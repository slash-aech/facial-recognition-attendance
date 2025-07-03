const express = require('express');
const pool = require('../config/timetableDbPool'); // adjust path if needed

const router = express.Router();

// GET /api/class/getClassByNameAndTimetableid?name=ClassName&timetable_id=timetableId
router.get('/getClassByNameAndTimetableid', async (req, res) => {
  const { name, timetable_id } = req.query;

  if (!name || !timetable_id) {
    return res.status(400).json({ message: 'Missing required query parameters: name and timetable_id' });
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM class WHERE name = $1 AND timetable_id = $2 LIMIT 1`,
      [name, timetable_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error fetching class:', err.message);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
