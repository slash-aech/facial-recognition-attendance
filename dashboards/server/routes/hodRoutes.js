const router = require('express').Router();

router.get('/teachers', async (req, res) => {
  const { department_id } = req.cookies;

  if (!department_id) {
    console.error('❌ Missing department_id in cookies');
    return res.status(400).json({ error: 'Missing department_id in cookies' });
  }

  try {
    const result = await db.query(
      `SELECT user_id, full_name, email_id FROM user_info WHERE department_id = $1 AND user_role = 'teacher'`,
      [department_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching department teachers:', err);
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});

module.exports = router;