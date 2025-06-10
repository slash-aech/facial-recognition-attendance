const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

router.get('/profile', authenticate, (req, res) => {
  // You can now access req.user (decoded JWT payload)
  res.status(200).json({
    message: 'Access granted to protected route',
    user: req.user, // { id, email, role, iat, exp }
  });
});

module.exports = router;
