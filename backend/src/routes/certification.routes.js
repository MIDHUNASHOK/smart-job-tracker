const express = require('express');

const router = express.Router();

const certificationController =
  require('../controllers/certification.controller');

  const authMiddleware =
  require('../middleware/auth.middleware');

router.get(
  '/',
  authMiddleware,
  certificationController.getCertifications
);

router.post(
  '/',
  authMiddleware,
  certificationController.addCertification
);

router.delete(
  '/:id',
  authMiddleware,
  certificationController.deleteCertification
);

module.exports = router;