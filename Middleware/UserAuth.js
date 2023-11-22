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
    let { _id, dateModified } = jwt.verify(token, process.env.SECRET);

    const user = await User.findById(_id);
    //user exists
    if (!user) {
      return res.status(403).json({ error: "UnAuthorized Access!" });
    }
    dateModified = new Date(dateModified);
    // Check if the timestamps match
    console.log(user.dateModified.getTime());
    console.log(dateModified.getTime());
    if (user.dateModified.getTime() != dateModified.getTime()) {
      return res.status(400).json({ error: "Expired token" });
    }
    req.userId = user._id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "UnAuthorized Request!" });
  }
};
module.exports = { verifyUser };
