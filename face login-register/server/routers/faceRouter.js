const express = require('express');
const router = express.Router();
const { checkFaceRegistration, registerFace } = require('../controllers/faceController');

router.post('/check', checkFaceRegistration);
router.post('/register', registerFace)

module.exports = router;