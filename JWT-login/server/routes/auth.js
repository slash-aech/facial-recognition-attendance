// backend/routes/auth.js
const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/Users');

const router = express.Router();

// Helper to generate JWT
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
};

// 1) Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    // Simple validation (you can expand as needed)
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'All fields required' });
    }
    // Hash password
    const hash = await bcrypt.hash(password, 10);
    // Create user
    const user = new User({ email, password: hash, role });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Registration failed' });
  }
});

// 2) Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    // 2. Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // 3. Generate access token
    const accessToken = generateAccessToken(user);
    // Return token + role
    res.json({ accessToken, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});
router.post('/logout', async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204); // No content

  try {
    const user = await User.findOne({ refreshToken: token });
    if (user) {
      user.refreshToken = '';
      await user.save();
    }
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/api/auth/refresh',
    });
    return res.sendStatus(204);
  } catch (err) {
    return res.sendStatus(500);
  }
});

module.exports = router;
