const express = require('express');
const { insertTimetableData } = require('../controllers/timeTableController');

module.exports = (onUploadCallback) => {
  const router = express.Router();

  router.post('/upload-timetable', async (req, res) => {
    const { parsedData, meta } = req.body;

    console.log('🟢 Received Timetable Upload Payload:');

    if (typeof onUploadCallback === 'function') {
      onUploadCallback(req.body); // ✅ Store for debugging
    }

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

  return router;
};
