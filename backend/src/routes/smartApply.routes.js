const express = require('express');

const authMiddleware =
  require('../middleware/auth.middleware');

const {
  analyzeJob
} = require('../controllers/smartApply.controller');

const router = express.Router();

router.post(
  '/analyze',
  authMiddleware,
  analyzeJob
);

module.exports = router;