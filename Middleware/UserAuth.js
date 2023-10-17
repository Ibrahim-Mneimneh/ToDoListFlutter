const jwt = require("jsonwebtoken");
const Task = require("../Models/taskModel");
const User = require("../Models/userModel");

const verifyUser = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required!" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(_id);
    //user exists
    if (!user) {
      res.status(403).json({ error: "UnAuthorized Access!" });
    }
    req.userId = user._id;
    next();
  } catch (error) {
    console.log(error);
    res.staus(401).json({ error: "UnAuthorized Request!" });
  }
};
module.exports = { verifyUser };
