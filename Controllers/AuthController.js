const userAuth = require("../Models/userAuth");
const createVerificationCode = (req, res) => {
  const random = Math.floor(
    Math.random() * (1000000 - 100000) + 100000
  ).toString();
  const nums = ["7", "1", "6", "9", "5", "2", "4", "0", "3", "8"];
  let code = "";
  for (let i = 0; i < random.length; i++) {
    code += nums[parseInt(random[i])];
  }
  console.log(code);
};
module.exports = { createVerificationCode };
