const express = require('express');

const router = express.Router();

const skillController =
  require('../controllers/skill.controller');

router.get(
  '/',
  skillController.getSkills
);

router.post(
  '/',
  skillController.addSkill
);

router.delete(
  '/:id',
  skillController.deleteSkill
);

module.exports = router;