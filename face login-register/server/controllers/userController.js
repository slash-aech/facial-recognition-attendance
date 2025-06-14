const bcrypt = require('bcrypt');
const db = require('../config/dbconfig');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const https = require('https');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('SELECT * FROM user_info WHERE enrollment_number = $1', [id]);
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

  // if (!enrollment_number || !newPassword) {
  //   return res.status(400).json({ message: 'enrollment_number and newPassword are required' });
  // }

  try {
    // 1. Get user_info.id (UUID) from enrollment_number
    const userInfoResult = await db.query(
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
    const result = await db.query(
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
    // Allow self-signed certificate (for development only)
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    // 1. Send image to face recognition API
    const response = await axios.post(
      process.env.FACE_API_URL + '/run-simple-face-check',
      { image },
      { httpsAgent }
    );

    const result = response.data;

    // 2. Check if a subject was returned
    if (
      !result.result || 
      !Array.isArray(result.result) || 
      !result.result[0]?.subjects?.length
    ) {
      return res.status(401).json({ message: 'Face not recognized' });
    }

    // 3. Decode base64 subject data
    const base64Subject = result.result[0].subjects[0].subject;
    const decoded = Buffer.from(base64Subject, 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded);
    const { Email: email, Pass: plainPassword } = parsed;

    if (!email || !plainPassword) {
      return res.status(400).json({ message: 'Invalid subject data' });
    }
    console.log(email)
    // 4. Look up user by email
    const userQuery = await db.query(
      'SELECT * FROM user_info WHERE email_id = $1',
      [email]
    );
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userInfo = userQuery.rows[0];
    console.log(userInfo)
    // 5. Get hashed password from user_authentication
    const authQuery = await db.query(
      'SELECT * FROM user_authentication WHERE user_info_id = $1',
      [userInfo.id]
    );
    if (authQuery.rows.length === 0) {
      return res.status(404).json({ message: 'Authentication record not found' });
    }
    const authInfo = authQuery.rows[0];

    // 6. Compare extracted password with hashed one
    console.log(plainPassword, authInfo.password)
    const isMatch = await bcrypt.compare(plainPassword, authInfo.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    // 7. Generate token
    const token = jwt.sign(
      { id: userInfo.id, email: userInfo.email_id, role: userInfo.user_role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    return res.status(200).json({
      message: 'Face login successful',
      token,
      user: {
        id: userInfo.id,
        email: userInfo.email_id,
        name: userInfo.full_name,
        role: userInfo.user_role,
      },
    });
  } catch (error) {
    console.error('Face login error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { getUserById, changePasswordByUserInfoId, faceLogin };
