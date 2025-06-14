const express = require('express');
const router = express.Router();
const {google} = require('googleapis');
const path = require('path');
const pool = require('../db');

router.post('/upload', async (req, res) => {
  let auth;
  try {
      auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, '../keys/service-account.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });
  }
  catch(err){
    console.error(err);
    res.status(500).send('Error logging to google.');
  }
  const { sheetId } = req.body;
  if (!sheetId) {
    return res.status(400).json({ message: 'Sheet ID is required' });
  }
  async function getSheetData(range = 'A2:N7') {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });
        const res = await sheets.spreadsheets.values.get({
          spreadsheetId: sheetId,
          range,
        });
        return res.data.values || [];
      }
  try{
    const rows = await getSheetData(); // Get data from Google Sheets
    if (!rows.length) return res.status(400).send('No data found in sheet');

    // Clear previous data (optional)
    await pool.query('DELETE FROM timetable');

    // Insert new data
    for (const row of rows) {
  await pool.query(
    `INSERT INTO timetable (
      day,
      "08:30 AM to 09:15 AM",
      "09:15 AM to 10:00 AM",
      "10:00 AM to 10:10 AM",
      "10:10 AM to 10:55 AM",
      "10:55 AM to 11:40 AM",
      "11:40 AM to 12:30 PM",
      "12:30 PM to 01:20 PM",
      "01:20 PM to 02:10 PM",
      "02:10 PM to 02:55 PM",
      "02:55 PM to 03:40 PM",
      "03:40 PM to 03:50 PM",
      "03:50 PM to 04:35 PM",
      "04:35 PM to 05:20 PM"
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
    )`,
    row
  );
}

    res.send('Timetable imported successfully.');
  }
   catch (err) {
    console.error(err);
    res.status(500).send('Error importing timetable.');
  }
});
module.exports = router;