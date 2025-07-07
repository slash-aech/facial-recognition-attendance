const pool = require('../config/dbconfig');

const getFacultyActiveToday = async (req, res) => {
  const { user_id, day } = req.query;
  console.log(req.query)

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id in query' });
  }

  const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayInput = (day || new Date().toLocaleDateString('en-US', { weekday: 'long' })).toLowerCase();

  if (!validDays.includes(dayInput)) {
    return res.status(400).json({ error: 'Invalid day provided' });
  }

  const dayIndexMap = {
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
    saturday: 5,
  };

  const dayIndex = dayIndexMap[dayInput];
  const selectedDate = new Date().toISOString().slice(0, 10);

  const query = `
  SELECT
    l.lesson_id,
    c.classroom_ids[1] AS classroom_id,
    cls.name AS classroom_name,
    s.name AS subject,
    p.start_time,
    p.end_time,
    c.period,
    EXISTS (
      SELECT 1 FROM session sess
      WHERE sess.classroom_id = c.classroom_ids[1]
        AND sess.period = c.period
        AND sess.is_active = true
        AND sess.start_time::date = $3
        AND sess.lesson_id = l.lesson_id  -- ✅ Fix to ensure correct session
    ) AS active
  FROM lesson l
  JOIN card c ON c.lesson_id = l.lesson_id
  JOIN subject s ON l.subject_id = s.subject_id
  JOIN periods p ON c.period = p.period
  JOIN teacher_enrollment_info tei ON tei.user_id = ANY(l.teacher_ids)
  JOIN classroom cr ON cr.classroom_id = c.classroom_ids[1]
  LEFT JOIN class cls ON cls.class_id = l.class_ids[1]
  WHERE tei.user_id = $1
    AND SUBSTRING(c.days FROM $2 + 1 FOR 1) = '1'
`;

 
  try {
    const result = await pool.query(query, [user_id, dayIndex, selectedDate]);
    console.log('[DEBUG] Raw rows from query:', result.rows);
    const formatted = result.rows.map(row => ({
    lesson_id: row.lesson_id,
    classroom_id: row.classroom_id || 'UNKNOWN',
    classroom_name: row.classroom_name || 'Unnamed Room',
    subject: row.subject || 'Untitled Subject',
    start_time: row.start_time || '00:00',
    end_time: row.end_time || '00:00',
    period: row.period ?? null,
    active: Boolean(row.active),
  }))
  .sort((a, b) => a.start_time.localeCompare(b.start_time));


    console.log(`📅 Faculty active today for ${dayInput}:`, formatted);
    return res.json(formatted);
  } catch (err) {
    console.error('❌ Error fetching faculty active today:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getFacultyActiveToday };
