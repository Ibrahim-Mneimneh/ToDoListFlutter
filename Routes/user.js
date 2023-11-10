const express = require("express");
const {
  loginUser,
  signupUser,
  toggle2FA,
  toggleBiometricAuth,
} = require("../Controllers/userController");
const { verifyUser } = require("../Middleware/UserAuth");
const router = express.Router();

router.post("/login", loginUser);

router.post("/signup", signupUser);
// Middleware for these 2 routes
router.use("/2FactorAuth", verifyUser);
router.use("/BiometricAuth", verifyUser);

router.get("/2FactorAuth", toggle2FA);
router.get("/BiometricAuth", toggleBiometricAuth);

module.exports = router;
