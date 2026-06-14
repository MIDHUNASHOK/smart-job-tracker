const express = require('express');

const router = express.Router();

const educationController =
  require('../controllers/education.controller');

router.get(
  '/',
  educationController.getEducations
);

router.post(
  '/',
  educationController.addEducation
);

router.delete(
  '/:id',
  educationController.deleteEducation
);

module.exports = router;