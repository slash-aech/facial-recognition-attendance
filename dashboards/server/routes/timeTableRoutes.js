const express = require('express');
const router = express.Router();
const { insertTimetableData } = require('../controllers/timeTableController');

router.post('/upload-timetable', async (req, res) => {
  const { parsedData, meta } = req.body;

  if (!parsedData || !meta) {
    return res.status(400).json({ success: false, message: 'Missing data or metadata' });
  }

  const result = await insertTimetableData(parsedData, meta);

  if (result.success) {
    res.status(200).json({ success: true, timetableId: result.timetableId });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});

module.exports = router;
