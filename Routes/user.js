const express = require("express");
const {
  loginUser,
  signupUser,
  toggle2FA,
  toggleBiometricAuth,
  getUser,
  changePassword,
  resetPassword,
} = require("../Controllers/userController");
const {
  resetPasswordRequest,
  deleteAccountRequest,
  deleteAccount,
} = require("../Controllers/AuthController");
const { verifyUser } = require("../Middleware/UserAuth");
const router = express.Router();

router.post("/login", loginUser);

router.post("/signup", signupUser);
router.post("/Request/ResetPassword", resetPasswordRequest);
// Middleware for these 2 routes
router.use("/ResetPassword", verifyUser);
router.use("/info", verifyUser);
router.use("/2FactorAuth", verifyUser);
router.use("/BiometricAuth", verifyUser);
router.use("/ChangePassword", verifyUser);
router.use("/Request/DeleteAccount", verifyUser);
router.use("/DeleteAccount", verifyUser);

router.post("/ResetPassword", resetPassword);
router.get("/Request/DeleteAccount", deleteAccountRequest);
router.delete("/DeleteAccount", deleteAccount);
router.get("/info", getUser);
router.get("/2FactorAuth", toggle2FA);
router.get("/BiometricAuth", toggleBiometricAuth);
router.post("/ChangePassword", changePassword);

module.exports = router;
