const express = require('express');

const router = express.Router();

const jobController = require('../controllers/job.controller');
router.get(
    '/',
    jobController.getAllJobs
  );

router.post(
  '/create',
  jobController.createJob
);

module.exports = router;