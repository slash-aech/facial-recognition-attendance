const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../middleware/auth');

router.get('/profile', authenticateToken, (req, res) => {
  // You can now access req.user (decoded JWT payload)
  res.status(200).json({
    message: 'Access granted to protected route',
    user: req.user, // { id, email, role, iat, exp }
  });
});

module.exports = router;
