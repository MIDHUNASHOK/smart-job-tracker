const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  getProfile
} = require("../controllers/user.controller");

// protected route
router.get(
  "/profile",
  authMiddleware,
  getProfile
);

module.exports = router;