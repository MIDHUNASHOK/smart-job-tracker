const express = require('express');

const router = express.Router();

const languageController =
  require('../controllers/language.controller');

  
const authMiddleware =
require('../middleware/auth.middleware');

router.get(
  '/',
  authMiddleware,
  languageController.getLanguages
);

router.post(
  '/',
  authMiddleware,
  languageController.addLanguage
);

router.delete(
  '/:id',
  authMiddleware,
  languageController.deleteLanguage
);

module.exports = router;