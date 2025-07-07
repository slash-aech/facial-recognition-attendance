const pool = require('../config/dbconfig');

const getStudentAttendanceTimetable = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id || typeof user_id !== 'string' || user_id.trim() === '') {
    return res.status(400).json({ error: 'Missing or invalid user_id in query' });
  }

  const currentDate = new Date();
  const currentDateISO = currentDate.toISOString().slice(0, 10); // YYYY-MM-DD
  const year = currentDate.getFullYear();
  const attendanceTable = `attendance_log_${year}`;

  try {
    const enrollmentCheck = await pool.query(
      `SELECT * FROM student_enrollment_information WHERE user_id = $1`,
      [user_id]
    );

    if (enrollmentCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Student not enrolled in any class' });
    }

    const query = `
      SELECT
        s.name AS subject,
        p.start_time,
        p.end_time,
        c.days,
        c.period,
        c.classroom_ids[1] AS classroom_id,
        cr.short AS classroom_short,
        cls.name AS class_name,
        g.name AS group_name
      FROM student_enrollment_information sei
      JOIN "group" g ON (
        g.group_id = sei.group_id
        OR (g.class_id = sei.class_id AND g.entire_class = true)
      )
      JOIN lesson l ON g.group_id = ANY(l.group_ids)
      JOIN subject s ON l.subject_id = s.subject_id
      JOIN card c ON c.lesson_id = l.lesson_id
      JOIN periods p ON p.period = c.period
      LEFT JOIN class cls ON sei.class_id = cls.class_id
      LEFT JOIN classroom cr ON cr.classroom_id = c.classroom_ids[1]
      JOIN session sess ON sess.classroom_id = c.classroom_ids[1]
                        AND sess.is_active = true
                        AND sess.start_time::date = $2
      WHERE sei.user_id = $1
        AND NOT EXISTS (
          SELECT 1 FROM ${attendanceTable} al
          WHERE al.student_id = sei.user_id
            AND al.session_id = sess.session_id
        )
    `;

    const result = await pool.query(query, [user_id, currentDateISO]);

    const daysMap = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const structured = result.rows.flatMap(row => {
      if (!row.days) return [];

      const binaryDays = row.days.padStart(6, '0');
      return binaryDays.split('').map((bit, i) =>
        bit === '1'
          ? {
              subject: row.subject,
              startTime: row.start_time,
              endTime: row.end_time,
              day: daysMap[i],
              period: row.period,
              classroom: row.classroom_short || '',
              classroom_id: row.classroom_id || '',
              class: row.class_name || '',
              group: row.group_name || '',
              attended: false,
            }
          : null
      ).filter(Boolean);
    });

    res.json(structured);
  } catch (err) {
    console.error('❌ Error fetching student timetable:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getStudentAttendanceTimetable };