const express = require('express');

const router = express.Router();

const languageController =
  require('../controllers/language.controller');

router.get(
  '/',
  languageController.getLanguages
);

router.post(
  '/',
  languageController.addLanguage
);

router.delete(
  '/:id',
  languageController.deleteLanguage
);

module.exports = router;