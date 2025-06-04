const db = require('../config/dbconfig');

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('SELECT * FROM user_info WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user by ID:', error.stack);
    res.status(500).send('Database error');
  }
};

module.exports = { getUserById };
