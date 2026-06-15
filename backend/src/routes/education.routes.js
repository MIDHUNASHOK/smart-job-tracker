const express = require('express');

const router = express.Router();

const educationController =
  require('../controllers/education.controller');

  const authMiddleware =
require('../middleware/auth.middleware');

router.get(
  '/',
  authMiddleware,
  educationController.getEducations
);

router.post(
  '/',
  authMiddleware,
  educationController.addEducation
);

router.delete(
  '/:id',
  authMiddleware,
  educationController.deleteEducation
);

module.exports = router;