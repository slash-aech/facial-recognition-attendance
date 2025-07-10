const express = require('express');
const router = express.Router();
const https = require('https');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify token and attach user to req
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// POST /api/attendance/mark
router.post('/mark', verifyToken, async (req, res) => {
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
    const { Email: faceEmail } = parsed;

    // Compare face email with user email in token
    if (req.user.email !== faceEmail) {
      return res.status(403).json({ message: 'Face does not match logged-in user' });
    }

    return res.status(200).json({
      message: 'Attendance marked successfully',
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Face attendance error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
