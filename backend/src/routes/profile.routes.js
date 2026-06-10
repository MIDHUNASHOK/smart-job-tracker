const express = require('express');

const router = express.Router();

const profileController =
  require('../controllers/profile.controller');

router.get(
  '/',
  profileController.getProfile
);

router.put(
  '/',
  profileController.saveProfile
);

module.exports = router;