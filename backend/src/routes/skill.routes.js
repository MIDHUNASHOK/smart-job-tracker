const express = require('express');

const router = express.Router();

const skillController =
  require('../controllers/skill.controller');

const authMiddleware =
  require('../middleware/auth.middleware');

router.get(
  '/',
  authMiddleware,
  skillController.getSkills
);

router.post(
  '/',
  authMiddleware,
  skillController.addSkill
);

router.delete(
  '/:id',
  authMiddleware,
  skillController.deleteSkill
);

module.exports = router;