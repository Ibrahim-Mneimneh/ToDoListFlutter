const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
var randomize = require("randomatic");
const bcrypt = require("bcrypt");

const { emailSender } = require("./emailController");
const UserAuth = require("../Models/authModel");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET);
};

const createVerificationPin = () => {
  const pin = randomize("0", 6);
  return pin;
};

const loginUser = async (req, res) => {
  const { signature, password } = req.body;
  try {
    const user = await User.login(signature, password);
    const isVerified = user.isVerified;
    const is2FAEnabled = user.is2FAEnabled;
    const token = createToken(user._id);

    // not verified
    if (!isVerified || is2FAEnabled) {
      const userAuth = await UserAuth.findOne({ userEmail: user.email });

      // if we didnt send him a code
      if (!userAuth) {
        let pin = createVerificationPin();
        const salt = await bcrypt.genSalt(10);
        hashedPin = await bcrypt.hash(pin, salt);
        const userAuth = await UserAuth.create({
          userEmail: user.email,
          pin: hashedPin,
        });
        emailSender(user.email, "Email Verification", user.username, pin);

        return res.status(200).json({
          token,
          is2FAEnabled,
          isVerified,
        });
      }
      // we check if we sent him an email but its expired
      if (userAuth.expiresIn < Date.now()) {
        // we delete it and send him a new one
        const deletedUserAuth = await UserAuth.findOneAndDelete({
          userEmail: user.email,
        });
        let pin = createVerificationPin();
        const salt = await bcrypt.genSalt(10);
        hashedPin = await bcrypt.hash(pin, salt);
        const userAuth = await UserAuth.create({
          userEmail: user.email,
          pin: hashedPin,
        });
        emailSender(user.email, "Email Verification", user.username, pin);

        return res.status(200).json({
          token,
          is2FAEnabled,
          isVerified,
        });
      } else {
        return res.status(200).json({
          token,
          is2FAEnabled,
          isVerified,
        });
      }
    }
    // we can delete the old ones here if possible
    const { _id, password: userPassword, ...userData } = user.toObject();
    return res.status(200).json({ token, ...userData });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const { user, salt } = await User.signup(username, email, password);
    let pin = createVerificationPin();
    hashedPin = await bcrypt.hash(pin, salt);
    const userAuth = await UserAuth.create({
      userEmail: email,
      pin: hashedPin,
    });
    await emailSender(email, "Email Verification", username, pin);
    const token = createToken(user._id);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const toggle2FA = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById({ _id: userId });
    const is2FA = user.is2FAEnabled;
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { is2FAEnabled: !is2FA },
      { new: true }
    );
    const {
      _id,
      password: userPassword,
      ...updatedUserData
    } = updatedUser.toObject();
    res.status(200).json(updatedUserData);
  } catch (err) {
    res.status(400).json(err);
  }
};

const toggleBiometricAuth = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById({ _id: userId });
    const isBioAuth = user.isBiometricAuthEnabled;
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { isBiometricAuthEnabled: !isBioAuth },
      { new: true }
    );

    const {
      _id,
      password: userPassword,
      ...updatedUserData
    } = updatedUser.toObject();
    res.status(200).json(updatedUserData);
  } catch (err) {
    res.status(400).json(err);
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    const { _id, password: userPassword, ...userData } = user.toObject();
    res.status(200).json(userData);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  loginUser,
  signupUser,
  toggle2FA,
  toggleBiometricAuth,
  getUser,
};
