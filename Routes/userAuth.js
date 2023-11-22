const express = require("express");
const {
  verifyEmail,
  verifyForgetPassword,
} = require("../Controllers/AuthController");
const { verifyUser } = require("../Middleware/UserAuth");
const router = express.Router();

router.use("/verifyEmail", verifyUser);

router.post("/verifyEmail", verifyEmail);
router.post("/ResetPassword", verifyForgetPassword);
module.exports = router;
