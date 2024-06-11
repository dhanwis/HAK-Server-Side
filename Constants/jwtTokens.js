const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, secretKey, { expiresIn: "15min" }); // Refresh token expires in 7 days
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, secretKey, { expiresIn: "7d" }); // Refresh token expires in 7 days
};

module.exports = { generateAccessToken, generateRefreshToken };
