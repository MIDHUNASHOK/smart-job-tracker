const express = require('express');

const {
  analyzeJob
} = require('../controllers/smartApply.controller');

const router = express.Router();

router.post('/analyze', analyzeJob);

module.exports = router;