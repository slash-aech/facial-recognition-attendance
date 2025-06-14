const express = require('express');
const router = express.Router();
const { checkFaceRegistration, registerFace } = require('../controllers/faceController');
console.log({ checkFaceRegistration, registerFace });


router.post('/check', checkFaceRegistration);
router.post('/register', registerFace)

module.exports = router;