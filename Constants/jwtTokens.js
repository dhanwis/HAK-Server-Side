const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_Token_Customer, {
    expiresIn: "15min",
  }); // Refresh token expires in 7 days
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_Token_Customer, {
    expiresIn: "7d",
  }); // Refresh token expires in 7 days
};

module.exports = { generateAccessToken, generateRefreshToken };
