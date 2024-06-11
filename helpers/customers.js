const { sendOTP, verifyOTP } = require("../OTP_functions/opt");

module.exports = {
  Otp_login: async (req, res) => {
    try {
      const { phoneNumber } = req.body;

      //send OTP;
      const verificationSid = await sendOTP(phoneNumber);

      // Handle OTP input
      const enterCode = req.body.otp; // Assuming OTP code is sent from client

      //verify OTP;
      const isValid = await verifyOTP(verificationSid, enterCode);

      //tokens generation
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      if (isValid) {
        // Successful login logic (replace with your authentication logic)
        //res.status(200).json({ message: "Login successful!" });

        res.send({
          accessToken,
          refreshToken,
          message: "Login successful!",
        });
      } else {
        res.status(401).send({ message: "Invalid OTP" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  },

  Otp_verification: async (req, res) => {},

  logout: () => {},
};
