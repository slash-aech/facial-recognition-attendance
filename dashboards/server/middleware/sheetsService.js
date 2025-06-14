const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'service-account.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheetId = '1zQRBpP2PqUTWmY8KnD4iC0bHNG4RYtiIeEeHWv0s4zY'; // Replace with your Google Sheet ID

async function getSheetData(range = 'Sheet1!A2:D') {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  return res.data.values || [];
}

module.exports = getSheetData;
