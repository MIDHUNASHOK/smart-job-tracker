const express = require('express');

const router = express.Router();

const jobController =
  require('../controllers/job.controller');

const authMiddleware =
  require('../middleware/auth.middleware');
  

router.get(
  '/',
  authMiddleware,
  jobController.getAllJobs
);

router.post(
  '/create',
  authMiddleware,
  jobController.createJob
);

router.get(
  '/check',
  authMiddleware,
  jobController.checkJobSaved
);
router.put(
  '/:id',
  authMiddleware,
  jobController.updateJob
);

router.delete(
  '/:id',
  authMiddleware,
  jobController.deleteJob
);

module.exports = router;