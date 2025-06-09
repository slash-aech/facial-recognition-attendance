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

const changePasswordByUserInfoId = async (req, res) => {
  const { user_info_id, newPassword } = req.body;

  if (!user_info_id || !newPassword) {
    return res.status(400).json({ message: 'user_info_id and newPassword are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await db.query(
      'UPDATE auth SET password = $1 WHERE user_info_id = $2 RETURNING id, username',
      [hashedPassword, user_info_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Auth record not found for given user_info_id' });
    }

    res.json({ message: 'Password updated successfully', user: result.rows[0] });
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
    // Create HTTPS agent that ignores invalid SSL certs (for dev only)
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    // 1. Call Python face recognition API with custom httpsAgent
    const response = await axios.post(
      process.env.FACE_API_URL + '/run-simple-face-check',
      { image },
      { httpsAgent }
    );

    const result = response.data;
    if (!result.result || !result.result[0] || !result.result[0].subjects || result.result[0].subjects.length === 0) {
      return res.status(401).json({ message: 'Face not recognized' });
    }

    // 2. Decode base64 subject to get email & password
    const base64Subject = result.result[0].subjects[0].subject;
    const decodedSubject = Buffer.from(base64Subject, 'base64').toString('utf-8');
    const parsedSubject = JSON.parse(decodedSubject);
    // console.log(decodedSubject)
    const { Email: email, Pass: plainPassword } = parsedSubject;
    console.log(parsedSubject)
    if (!email || !plainPassword) {
      return res.status(400).json({ message: 'Email or password not found in subject data' });
    }
    // console.log(email, password)
    // 3. Get user_info record
    const userQuery = await db.query('SELECT * FROM user_info WHERE email = $1', [email]);
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userInfo = userQuery.rows[0];
    // 4. Get password from auth table using user_info.id
    const authQuery = await db.query('SELECT * FROM auth WHERE user_info_id = $1', [userInfo.id]);
    if (authQuery.rows.length === 0) {
      return res.status(404).json({ message: 'Auth info not found' });
    }

    const authInfo = authQuery.rows[0];

    // 5. Verify face-extracted password with hashed password in DB
    const isPasswordMatch = await bcrypt.compare(plainPassword, authInfo.password);
    console.log(isPasswordMatch)
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Authentication failed: Incorrect password' });
    }

    // 6. Generate JWT
    const token = jwt.sign({ id: userInfo.id, email: userInfo.email }, JWT_SECRET, {
      expiresIn: '30d',
    });

    return res.status(200).json({
      message: 'Face login successful',
      token,
      user: {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
      },
    });
  } catch (error) {
    console.error('Face login error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


module.exports = { getUserById, changePasswordByUserInfoId, faceLogin };
