const db = require('../config/dbconfig');
const PDFDocument = require('pdfkit');
const moment = require('moment');

const getFacultyReport = async (req, res) => {
  console.log('🔍 Received request to generate faculty attendance report:', req.body);
  const { class_name, start_date, end_date } = req.body;

  if (!class_name || !start_date || !end_date) {
    return res.status(400).json({ error: 'Missing required fields: class_name, start_date, end_date' });
  }

  try {
    console.log(`📅 Generating report for class: ${class_name}, date range: ${start_date} to ${end_date}`);

    // Step 1: Get class_id from class_name
    const classRes = await db.query(
      `SELECT class_id FROM class WHERE name = $1 LIMIT 1`,
      [class_name]
    );

    if (classRes.rowCount === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const classId = classRes.rows[0].class_id;

    // Step 2: Get all lessons that include this class_id
    const lessonRes = await db.query(
      `SELECT lesson_id FROM lesson WHERE $1 = ANY(class_ids)`,
      [classId]
    );

    const lessonIds = lessonRes.rows.map(l => l.lesson_id);
    if (lessonIds.length === 0) {
      return res.status(404).json({ error: 'No lessons found for this class' });
    }

    // Step 3: Get sessions for these lessons in range
    const sessionRes = await db.query(
      `SELECT session_id, start_time::date AS date, lesson_id FROM session
       WHERE lesson_id = ANY($1::uuid[])
         AND start_time::date BETWEEN $2 AND $3`,
      [lessonIds, start_date, end_date]
    );

    const sessions = sessionRes.rows;
    if (sessions.length === 0) return res.status(404).json({ error: 'No sessions found in date range' });

    const sessionMap = new Map();
    sessions.forEach(s => sessionMap.set(s.session_id, s.date));
    const dates = Array.from(new Set(sessions.map(s => s.date))).sort();

    // Step 4: Get attendance logs
    const attendanceRes = await db.query(
      `SELECT session_id, student_id, final_status
       FROM attendance_log_2025
       WHERE session_id = ANY($1::uuid[])`,
      [sessions.map(s => s.session_id)]
    );

    const studentMap = new Map(); // student_id => { logs: { date: 1|0 }, total }
    attendanceRes.rows.forEach(row => {
      const date = sessionMap.get(row.session_id);
      const status = row.final_status === 'present' ? 1 : 0;
      if (!studentMap.has(row.student_id)) {
        studentMap.set(row.student_id, { logs: {}, total: 0 });
      }
      const entry = studentMap.get(row.student_id);
      entry.logs[date] = status;
      entry.total += status;
    });

    // Step 5: Generate PDF
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res
        .writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="attendance_report.pdf"`,
          'Content-Length': pdfData.length,
        })
        .end(pdfData);
    });

    // Header
    doc.fontSize(16).text('Attendance Report', { align: 'center' });
    doc.text(`Class: ${class_name}`, { align: 'center' });
    doc.text(`From: ${start_date} To: ${end_date}`, { align: 'center' });
    doc.moveDown();

    // Table Header
    doc.fontSize(10).text('Student ID', { continued: true });
    dates.forEach(d => doc.text(` | ${moment(d).format('MM-DD')}`, { continued: true }));
    doc.text(' | Total');

    // Table Rows
    for (const [studentId, entry] of studentMap.entries()) {
      doc.text(studentId, { continued: true });
      dates.forEach(d => {
        doc.text(` | ${entry.logs[d] ?? 0}`, { continued: true });
      });
      doc.text(` | ${entry.total}`);
    }

    doc.end();
  } catch (err) {
    console.error('❌ Error generating class report:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getFacultyReport };
