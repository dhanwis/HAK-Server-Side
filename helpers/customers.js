const {
  generateAccessToken,
  generateRefreshToken,
} = require("../Constants/jwtTokens");

const dotenv = require("dotenv");
dotenv.config();

const twilioClient = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = {
  Otp_login: async (req, res, next) => {
    try {
      const { phoneNumber } = req.body;
    

      //const existingPhone = customers.find({ phoneNumber: phoneNumber });

      //console.log("existingPhone", existingPhone);

      // if (existingPhone) {
      //   console.log("user already registered");
      
      // }

      const verification = await twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verifications.create({ to: `+91${phoneNumber}`, channel: "sms" });

      //currentNum = phoneNumber;
      res.status(201).json({ verificationSid: verification.sid });
      next(null, phoneNumber); // Pass phoneNumber to next middleware
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  
  },

  Otp_verification: async (req, res,next,phoneNumber) => {
    const { otp } = req.body;
    console.log("otp from manji", otp);

    try {
      // const verificationCheck = await twilioClient.verify.v2
      //   .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      //   .verifications(verificationSid)
      //   .check({ otp });

      twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({ to: `+918590378051`, code: otp })
        .then((verification_check) => console.log(verification_check.status));

      //tokens generation
      const accessToken = generateAccessToken(6393);
      const refreshToken = generateRefreshToken(6393);

      //console.log("manjima", req.phone);
      console.log('phoneNumber', phoneNumber); // Access phoneNumber directly
      res.status(200).json({
        message: "Manjima vannu pozhi Pottathi",
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (error) {
      console.error(error);
      throw new Error("Error verifying OTP");
    }

    // try {
    //   const { otp, userId } = req.body;

    //   console.log("manji enter cheythath", otp);

    // } catch (error) {
    //   next(error);
    // }
  },

  logout: () => {},
};
