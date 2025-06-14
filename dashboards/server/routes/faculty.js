// routes/facultyUpload.js
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
    async function getSheetData(range = 'Sheet1') {
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
    console.log(rows);
    if (!rows.length) return res.status(400).send('No data found in sheet');

    // Clear previous data (optional)
    await pool.query('DELETE FROM faculty_details');
    
    const insertQuery = `
    INSERT INTO faculty_details (faculty_name, email, department, subject, batch)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO UPDATE SET
         faculty_name = EXCLUDED.faculty_name,
         department = EXCLUDED.department,
         subject = EXCLUDED.subject,
         batch = EXCLUDED.batch
    `;

    for (const row of rows.slice(1)) {
  await pool.query(insertQuery, row);
}
    res.status(200).json({ message: 'Faculty data uploaded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;