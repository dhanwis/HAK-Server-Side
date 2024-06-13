const {
  generateAccessToken,
  generateRefreshToken,
} = require("../Constants/jwtTokens");

const dotenv = require("dotenv");
const customers = require("../Models/Customers/customers");
dotenv.config();

const twilioClient = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = {
  Otp_login: async (req, res) => {
    try {
      const { phoneNumber } = req.body;

      console.log("manji adichath", phoneNumber);

      const verification = await twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verifications.create({ to: `+91${phoneNumber}`, channel: "sms" });

      console.log(verification);
      res.status(201).json({ verificationSid: verification.sid }); //server sendint an id to client (verifcationSid)
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  },

  Otp_verification: async (req, res) => {
    const { otp, verificationSid } = req.body;
    console.log("otp from manji", otp);

    try {
      // const verificationCheck = await twilioClient.verify.v2
      //   .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      //   .verifications(verificationSid)
      //   .check({ otp }).then((verification_check)=>console.log(verification_check.status))

      twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({ to: `+919074434030`, code: otp })
        .then((verification_check) => console.log(verification_check.status));

      //tokens generation
      const accessToken = generateAccessToken(6393);
      const refreshToken = generateRefreshToken(6393);

      //console.log("manjima", req.phone);

      res.status(200).json({
        message: "Manjima vannu pozhi Pottathi",
        access: accessToken,
        refresh: refreshToken,
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

  customer_profile_creation: (req, res) => {},
};
