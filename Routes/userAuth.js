const express = require("express");
const { verifyEmail } = require("../Controllers/AuthController");
const router = express.Router();

router.post("/verifyEmail", verifyEmail);

module.exports = router;
