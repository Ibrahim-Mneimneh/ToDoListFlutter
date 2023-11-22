const User = require("../Models/userModel");
const UserAuth = require("../Models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const FPAuth = require("../Models/FPAuthModel");
const validator = require("validator");
var randomize = require("randomatic");
const { emailSender } = require("./emailController");
const createToken = (_id, dateModified) => {
  return jwt.sign({ _id, dateModified }, process.env.SECRET, {
    expiresIn: "30d",
  });
};

const createVerificationPin = () => {
  const pin = randomize("0", 6);
  return pin;
};

const verifyEmail = async (req, res) => {
  const { pin } = req.body;
  const userId = req.userId;
  try {
    const userAuth = await UserAuth.findOne({ userId });
    // check for the userAuth
    if (!userAuth) {
      return res.status(403).json({ error: "UnAuthorized Access!" });
    }
    // check if the token is expired if so delete it
    if (userAuth.expiresIn < Date.now()) {
      const deletedUserAuth = await UserAuth.findOneAndDelete({
        userId,
      });
      return res.status(400).json({ error: "Session expired" });
    }
    if (userAuth.trials >= 4) {
      return res.status(403).json({ error: "UnAuthorized Access!" });
    }
    const match = await bcrypt.compare(pin, userAuth.pin);
    // if the pin  doesn't matches that in the database
    if (!match) {
      const updatedAuth = await UserAuth.findOneAndUpdate(
        { userId },
        { trials: userAuth.trials + 1 }
      );
      return res.status(403).json({ error: "UnAuthorized Access!" });
    }
    // update the user to verified
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { isVerified: true }
    );
    //send the user data
    const {
      _id,
      dateModified,
      password: userPassword,
      ...userData
    } = updatedUser.toObject();
    const token = createToken(updatedUser._id, dateModified);
    return res.status(200).json({ token, ...userData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const verifyForgetPassword = async (req, res) => {
  const { pin, email } = req.body;
  if (!pin || !email) {
    res.status(400).json({ error: "Please fill all required fields." });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "User Not found" });
    }
    const fpAuth = await FPAuth.findOne({ userEmail: email });
    // check for the userAuth
    if (!fpAuth) {
      return res.status(403).json({ error: "UnAuthorized Access!" });
    }
    // check if the token is expired if so delete it
    if (fpAuth.expiresIn < Date.now()) {
      const deletedfpAuth = await FPAuth.findOneAndDelete({
        userEmail: email,
      });
      let pin = createVerificationPin();
      const salt = await bcrypt.genSalt(10);
      const hashedPin = await bcrypt.hash(pin, salt);
      const newfpauth = await FPAuth.create({
        userId: identity._id,
        userEmail: identity.email,
        pin: hashedPin,
      });
      if (!newfpauth) {
        return res.status(400).json({ error: error.message });
      }
      emailSender(
        user.email,
        "Reset Password Verification",
        user.username,
        pin,
        "forgetPassword.hbs"
      );
      return res
        .status(400)
        .json({ error: "Session expired, a new email was sent!" });
    }
    if (fpAuth.trials >= 4) {
      return res.status(403).json({ error: "UnAuthorized Access!" });
    }
    const match = await bcrypt.compare(pin, fpAuth.pin);
    // if the pin  doesn't matches that in the database
    if (!match) {
      const updatedAuth = await FPAuth.findOneAndUpdate(
        { userEmail: email },
        { trials: fpAuth.trials + 1 }
      );
      return res.status(403).json({ error: "UnAuthorized Access!" });
    }
    //send the user data
    const token = createToken(user._id, user.dateModified);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Send a request to make a pin and sends an email to the user
const resetPasswordRequest = async (req, res) => {
  const { signature } = req.body;
  try {
    let identity;
    if (validator.isEmail(signature)) {
      identity = await User.findOne({ email: signature });
    } else {
      identity = await User.findOne({ username: signature });
    }
    if (!identity) {
      return res.status(404).json({ error: "Invalid Email/Username." });
    }
    let pin = createVerificationPin();
    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(pin, salt);
    const fpauth = await FPAuth.create({
      userId: identity._id,
      userEmail: identity.email,
      pin: hashedPin,
    });
    if (!fpauth) {
      return res.status(400).json({ error: error.message });
    }
    let email = identity.email;
    const [name, domain] = email.split("@");

    let censoredEmail =
      name.slice(0, 3) + "*".repeat(name.length - 2) + "@" + domain;
    emailSender(
      identity.email,
      "Reset Password Verification",
      identity.username,
      pin,
      "forgetPassword.hbs"
    );
    res.status(200).json({ email: censoredEmail });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { verifyEmail, resetPasswordRequest, verifyForgetPassword };
