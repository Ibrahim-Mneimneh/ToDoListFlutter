const express = require("express");
const { emailSender } = require("../Controllers/AuthController");

const router = express.Router();

router.get("/verifyEmail", emailSender);

module.exports = router;
