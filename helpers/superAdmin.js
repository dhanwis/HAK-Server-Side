const jwt = require("jsonwebtoken");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (email === "admin@gmail.com" && password === "password1") {
        
      }

      if (!user || !(await bcrypt.compare(password, user.password))) {
        //const user = await // Your logic to find user by email

        return res.status(401).send({ message: "Invalid credential" });
      }

      // Generate access and refresh tokens
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      res.send({
        accessToken,
        refreshToken,
        message: "Login successful",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  },

  logout: () => {},
};
