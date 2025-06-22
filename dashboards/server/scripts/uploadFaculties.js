const fetchGoogleSheet = require('../utils/fetchGoogleSheet');
const uploadToUserInfo = require('../utils/uploadToUserinfo');

const spreadsheetId = '1Ri1uqbt6ITZwN55qzmmK7B4HJz1zgUAyEKeVDx0WxV8';
const sheetName = 'SWFaculties';

// Replace these with actual UUIDs from your DB
const INSTITUTE_ID = '06692d66-91d7-46b3-9f28-1ac277ac4457';
const DEPT_ID = '2fc5cc90-7b8e-462d-a80a-9e8995c6bafe';

function parseFacultyRow(row) {
  const user_id = row[2]?.trim(); // Employee ID
  const full_name = row[3]?.trim();
  const institute_email_id = row[4]?.trim();
  return [user_id, full_name, institute_email_id];
}

async function run() {
  const rows = await fetchGoogleSheet(spreadsheetId, sheetName);
  if (rows.length) {
    await uploadToUserInfo(rows, parseFacultyRow, 'teacher', INSTITUTE_ID, DEPT_ID);
  }
}

run();
