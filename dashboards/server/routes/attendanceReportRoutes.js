const express = require('express');
const router = express.Router();
const db = require('../config/dbconfig');

// PATCH /report/faculty/classes
router.patch('/faculty/classes', async (req, res) => {
  const { teacher_id } = req.body;

  if (!teacher_id) {
    return res.status(400).json({ error: 'Missing teacher_id' });
  }

  try {
    const query = `
      SELECT DISTINCT
        cls.class_id,
        cls.name AS class_name,
        s.name AS subject_name,
        s.subject_id
      FROM lesson l
      JOIN class cls ON cls.class_id = l.class_ids[1]
      JOIN subject s ON s.subject_id = l.subject_id
      JOIN teacher_enrollment_info t ON t.user_id = ANY(l.teacher_ids)
      WHERE t.user_id = $1
    `;
    const result = await db.query(query, [teacher_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching assigned classes:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// PATCH /report/faculty/generate
router.patch('/faculty/generate', async (req, res) => {
  const { teacher_id, class_name, start_date, end_date } = req.body;

  if (!teacher_id || !start_date || !end_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const lessonQuery = `
      SELECT 
        l.lesson_id,
        cls.name AS class_name
      FROM lesson l
      JOIN class cls ON cls.class_id = l.class_ids[1]
      JOIN teacher_enrollment_info t ON t.user_id = ANY(l.teacher_ids)
      WHERE t.user_id = $1
        ${class_name ? 'AND cls.name = $2' : ''}
    `;
    const lessonParams = class_name ? [teacher_id, class_name] : [teacher_id];
    const lessonRes = await db.query(lessonQuery, lessonParams);

    if (lessonRes.rowCount === 0) {
      return res.status(404).json({ error: 'No lessons found for this teacher' });
    }

    const lessonIds = lessonRes.rows.map(row => row.lesson_id);
    const classNames = [...new Set(lessonRes.rows.map(row => row.class_name))].join(', ');

    const sessionRes = await db.query(
      `SELECT session_id, start_time::date AS date, lesson_id
       FROM session
       WHERE lesson_id = ANY($1)
         AND start_time::date BETWEEN $2 AND $3`,
      [lessonIds, start_date, end_date]
    );

    const sessions = sessionRes.rows;
    if (sessions.length === 0) {
      return res.status(404).json({ error: 'No sessions found in date range' });
    }

    const sessionMap = new Map();
    sessions.forEach(s => sessionMap.set(s.session_id, s.date));
    const dates = Array.from(new Set(sessions.map(s => s.date))).sort();

    const attendanceRes = await db.query(
      `SELECT session_id, student_id, final_status
       FROM attendance_log_2025
       WHERE session_id = ANY($1)`,
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

    // PDF Generation
    const PDFDocument = require('pdfkit');
    const moment = require('moment');
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

    doc.fontSize(16).text('Attendance Report', { align: 'center' });
    doc.fontSize(12).text(`Class(es): ${classNames}`, { align: 'center' });
    doc.text(`From: ${start_date} To: ${end_date}`, { align: 'center' });
    doc.moveDown();

    doc.fontSize(10).text('Student ID', { continued: true });
    dates.forEach(d => doc.text(` | ${moment(d).format('MM-DD')}`, { continued: true }));
    doc.text(' | Total');

    for (const [studentId, entry] of studentMap.entries()) {
      doc.text(studentId, { continued: true });
      dates.forEach(d => {
        doc.text(` | ${entry.logs[d] ?? 0}`, { continued: true });
      });
      doc.text(` | ${entry.total}`);
    }

    doc.end();
  } catch (err) {
    console.error('❌ Error generating faculty report:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
