const express = require('express');
const multer = require('multer');
const { uploadStudentExcel } = require('../controllers/uploadStudentController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for parsing buffer

router.post('/', upload.single('file'), uploadStudentExcel);

module.exports = router;