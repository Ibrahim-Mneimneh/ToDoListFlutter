const express = require("express");
const {
  verifyEmail,
  verifyForgetPassword,
} = require("../Controllers/AuthController");
const router = express.Router();

router.post("/verifyEmail", verifyEmail);
router.post("/ResetPassword", verifyForgetPassword);
module.exports = router;
