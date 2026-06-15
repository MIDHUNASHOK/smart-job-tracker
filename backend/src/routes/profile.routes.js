// const express = require('express');

// const router = express.Router();

// const profileController =
//   require('../controllers/profile.controller');

// router.get(
//   '/',
//   profileController.getProfile
// );

// router.put(
//   '/',
//   profileController.saveProfile
// );

// module.exports = router;



const express = require('express');

const router = express.Router();

const profileController =
  require('../controllers/profile.controller');

const authMiddleware =
  require('../middleware/auth.middleware');

router.get(
  '/',
  authMiddleware,
  profileController.getProfile
);

router.put(
  '/',
  authMiddleware,
  profileController.saveProfile
);

module.exports = router;