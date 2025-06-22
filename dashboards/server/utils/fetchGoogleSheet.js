const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../services', 'service-account.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

async function fetchGoogleSheet(spreadsheetId, sheetName) {
  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetName,
    });

    const rows = res.data.values;
    if (!rows || rows.length < 2) {
      console.log(`No data found in sheet "${sheetName}"`);
      return [];
    }

    return rows.slice(1); // Skip headers
  } catch (err) {
    console.error(`❌ Failed to fetch Google Sheet: ${err.message}`);
    return [];
  }
}

module.exports = fetchGoogleSheet;
