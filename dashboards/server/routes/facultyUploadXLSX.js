const express = require('express');
const multer = require('multer');
const { uploadTeacherExcel } = require('../controllers/uploadTeacherController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for parsing buffer

router.post('/', upload.single('file'), uploadTeacherExcel);

module.exports = router;
