
const express = require('express');

const authMiddleware =
  require('../middleware/auth.middleware');

const {
  analyzeJob,
  generateApplication
} = require('../controllers/smartApply.controller');

const router = express.Router();

router.post(
  '/analyze',
  authMiddleware,
  analyzeJob
);

router.post(
  '/generate',
  authMiddleware,
  generateApplication
);

module.exports = router;