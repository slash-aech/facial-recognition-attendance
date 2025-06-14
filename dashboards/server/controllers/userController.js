const bcrypt = require('bcrypt');
const pool = require('../db');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const https = require('https');

dotenv.config();


const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM user_info WHERE enrollment_number = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user by ID:', error.stack);
    res.status(500).send('Database error');
  }
};

const changePasswordByUserInfoId = async (req, res) => {
  console.log("******************************************************");
  const { user_info_id, newPassword } = req.body;
  console.log(req.body);


  try {
    // 1. Get user_info.id (UUID) from enrollment_number
    const userInfoResult = await pool.query(
      'SELECT id FROM user_info WHERE enrollment_number = $1',
      [user_info_id]
    );
    if (userInfoResult.rowCount === 0) {
      return res.status(404).json({ message: 'User with given enrollment number not found' });
    }

    const userInfoId = userInfoResult.rows[0].id;

    // 2. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update the password in user_authentication using user_info_id (UUID)
    const result = await pool.query(
      'UPDATE user_authentication SET password = $1 WHERE user_info_id = $2 RETURNING auth_id, email_id',
      [hashedPassword, userInfoId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Authentication record not found for this user' });
    }

    res.json({
      message: 'Password updated successfully',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const faceLogin = async (req, res) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ message: 'Image is required' });
  }

  try {
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    const response = await axios.post(
      process.env.FACE_API_URL + '/run-simple-face-check',
      { image },
      { httpsAgent }
    );

    const result = response.data;

    if (
      !result.result || 
      !Array.isArray(result.result) || 
      !result.result[0]?.subjects?.length
    ) {
      return res.status(401).json({ message: 'Face not recognized' });
    }

    const base64Subject = result.result[0].subjects[0].subject;
    const decoded = Buffer.from(base64Subject, 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded);
    const { Email: email, Pass: plainPassword } = parsed;

    if (!email || !plainPassword) {
      return res.status(400).json({ message: 'Invalid subject data' });
    }

    // 👇️ Try to login the same way as /login
    const [rows] = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows;

    if (!user || !(await bcrypt.compare(plainPassword, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.json({ role: user.role });

  } catch (error) {
    console.error('Face login error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { getUserById, changePasswordByUserInfoId, faceLogin };
