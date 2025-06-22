const { google } = require('googleapis');
const pool = require('../config/timetableDbPool'); // assumes you already configured this
const path = require('path');

// Google Auth
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../services', 'service-account.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const spreadsheetId = '1Ri1uqbt6ITZwN55qzmmK7B4HJz1zgUAyEKeVDx0WxV8';
const sheetName = 'SWFaculties';

async function uploadFacultyData() {
  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetName,
    });

    const rows = res.data.values;

    if (!rows || rows.length < 2) {
      console.log('No data found in sheet.');
      return;
    }

    const client = await pool.connect();

    try {
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const user_id = row[2]?.trim(); // Employee ID
        const full_name = row[3]?.trim();
        const institute_email_id = row[4]?.trim();

        if (!user_id || !full_name || !institute_email_id) {
          console.log(`Skipping row ${i + 1}: missing required data.`);
          continue;
        }

        await client.query(
          `INSERT INTO user_info (user_id, full_name, institute_email_id, user_role)
           VALUES ($1, $2, $3, 'teacher')
           ON CONFLICT (user_id) DO UPDATE SET
             full_name = EXCLUDED.full_name,
             institute_email_id = EXCLUDED.institute_email_id`,
          [user_id, full_name, institute_email_id]
        );

        console.log(`✔️ Processed user_id: ${user_id}`);
      }

      console.log('\n✅ All data processed successfully.');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('❌ Error uploading faculty data:', err.message);
  }
}

uploadFacultyData();
