const validator = require("validator");

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

UserSchema.statics.signup = async function (username, email, password) {
  if (!email || !username || !password) {
    throw Error("All fields must be filled");
  } else {
    if (!validator.isEmail(email)) {
      throw Error("Please enter a valid email.");
    } else {
      if (!validator.isStrongPassword(password)) {
        throw Error(
          "Make sure your password has at least 8 characters with a number, a special character, an uppercase and a lowercase character"
        );
      } else {
        const usedEmail = await this.findOne({ email });
        const usedUsername = await this.findOne({ username });
        if (usedEmail) {
          throw Error("Email already in-use.");
        }
        if (usedUsername) {
          throw Error("Username already in-use.");
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = await this.create({ email, username, password: hash });
        return user;
      }
    }
  }
};

UserSchema.statics.login = async function (signature, password) {
  if (!signature || !password) {
    throw Error("All fields must be filled.");
  }

  var identity = "";
  if (validator.isEmail(signature)) {
    identity = await this.findOne({ email: signature });
  } else {
    identity = await this.findOne({ username: signature });
  }
  if (!identity) {
    throw Error("Invalid Email/Username or Password.");
  }
  const match = await bcrypt.compare(password, identity.password);
  if (!match) {
    throw Error("Invalid Email/Username or Password.");
  }
  return identity;
};

module.exports = mongoose.model("User", UserSchema);
