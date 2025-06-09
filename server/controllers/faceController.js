import axios from 'axios';
import https from 'https';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'

dotenv.config();

const FACE_API_URL = process.env.FACE_API_URL;
const FACE_API_KEY = process.env.FACE_API_KEY;
const CONFIDENCE_THRESHOLD = 0.8;

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export async function isFaceRegistered(base64Image) {
  try {
    const body = { file: base64Image };
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': FACE_API_KEY,
    };
    const response = await axios.post(
      `${FACE_API_URL}/recognize`,
      body,
      { headers, httpsAgent }
    );

    const data = response.data;

    if (data && Array.isArray(data.result)) {
      for (const match of data.result) {
        if (match.confidence >= CONFIDENCE_THRESHOLD) {
          return true;
        }
      }
    }
    return false;
  } catch (error) {
    console.error('Face recognition API error:', error.message);
    return false;
  }
}

export async function checkFaceRegistration(req, res) {
  const { base64Image } = req.body;

  if (!base64Image) {
    return res.status(400).json({ error: 'base64Image is required' });
  }

  const registered = await isFaceRegistered(base64Image);

  res.json({ registered });
}

export async function registerFace(req, res) {
  console.log('Full req.body:', req.body);

  const { subject, base64Image, email, password, user_role } = req.body;
  if (!subject || !base64Image || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

  if (!base64Data) {
    return res.status(400).json({ error: 'Invalid base64 image data' });
  }

  try {
    const body = {
      subject,
      image: base64Data,
      email,
      pass: password
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': FACE_API_KEY,
    };
    const response = await axios.post(`${FACE_API_URL}/add_face_subject`, body, {
      headers,
      httpsAgent,
    });
    console.log(response)
    // const user_role = 'student';

    // Generate JWT token
    const token = jwt.sign(
      { subject, email, user_role },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '30d' }
    );
    res.status(200).json({
      message: 'Face registration successful',
      token
    });

  } catch (err) {
    if (err.response) {
      console.error('Face registration error:', err.response.data);
    } else {
      console.error('Face registration error:', err.message);
    }
    res.status(500).json({ error: 'Face registration failed' });
  }
}
