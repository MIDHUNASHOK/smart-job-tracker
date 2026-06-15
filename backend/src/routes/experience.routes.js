const express = require('express');

const router = express.Router();

const experienceController =
  require('../controllers/experience.controller');
  const authMiddleware =
  require('../middleware/auth.middleware');

router.get(
  '/',
  authMiddleware,
  experienceController.getExperiences
);

router.post(
  '/',
  authMiddleware,
  experienceController.addExperience
);

router.delete(
  '/:id',
  authMiddleware,
  experienceController.deleteExperience
);

module.exports = router;


