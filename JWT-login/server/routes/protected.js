const express = require('express');
const { authenticateJWT, authorizeRole } = require('../middleware/auth'); // your auth middleware
const router = express.Router();

// Admin-only route
router.get('/admin-only', authenticateJWT, authorizeRole('admin'), (req, res) => {
  res.json({ message: 'Admin data accessed' });
});

// User-only route
router.get('/user-only', authenticateJWT, authorizeRole('user'), (req, res) => {
  res.json({ message: 'User data accessed' });
});

module.exports = router;
