const express = require('express');
const router = express.Router();
const { getUserById, changePasswordByUserInfoId, faceLogin } = require('../controllers/userController');

router.get('/user/:id', getUserById);
router.post('/user/changePassword', changePasswordByUserInfoId)
router.post('/user/face-login', faceLogin);

module.exports = router;