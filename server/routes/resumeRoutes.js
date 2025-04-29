const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const { uploadResume } = require('../controllers/resumeController');
const { matchJobs } = require('../controllers/jobController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX allowed.'));
    }
  },
});

router.post('/upload', authMiddleware, upload.single('resume'), uploadResume);
router.post('/match-jobs', authMiddleware, matchJobs);
router.get('/jobs', authMiddleware, matchJobs);

module.exports = router;