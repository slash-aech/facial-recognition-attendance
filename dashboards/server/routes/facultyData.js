const express = require('express');
const router = express.Router();
const pool = require('../config/timetableDbPool');

router.get('/facultyDataByTimetableId', async (req, res) => {
    const { short, timetable_id } = req.query;

    if (!short || !timetable_id) {
        return res.status(400).json({ error: 'short and timetable_id are required' });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM teacher_enrollment_info 
             WHERE short = $1 AND timetable_id = $2`,
            [short, timetable_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Faculty not found for this timetable id' });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching faculty:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
