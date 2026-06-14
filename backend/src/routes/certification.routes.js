const express = require('express');

const router = express.Router();

const certificationController =
  require('../controllers/certification.controller');

router.get(
  '/',
  certificationController.getCertifications
);

router.post(
  '/',
  certificationController.addCertification
);

router.delete(
  '/:id',
  certificationController.deleteCertification
);

module.exports = router;