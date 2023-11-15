const User = require("../Models/userModel");
const UserAuth = require("../Models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET);
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
    const { _id, password: userPassword, ...userData } = updatedUser.toObject();
    const token = createToken(updatedUser._id);
    return res.status(200).json({ token, ...userData });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
module.exports = { verifyEmail };
