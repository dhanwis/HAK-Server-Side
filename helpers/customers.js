const customers = require("../Models/Customers/customers");

const dotenv = require("dotenv");
dotenv.config();

const twilioClient = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = {
  Otp_login: async (req, res) => {
    try {
      const { phoneNumber } = req.body;

      const existingPhone = customers.find({ phoneNumber: phoneNumber });

      console.log(existingPhone);

      // if (existingPhone) {
      //   console.log("user already registered");
      // }

      const verification = await twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verifications.create({ to: `+91${phoneNumber}`, channel: "sms" });

      req.phone = phoneNumber;
      res.status(201).json({ verificationSid: verification.sid });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  },

  Otp_verification: async (req, res) => {
    const { otp } = req.body;

    try {
      // const verificationCheck = await twilioClient.verify.v2
      //   .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      //   .verifications(verificationSid)
      //   .check({ otp });

      twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({ to: `+91 9074434030`, code: otp })
        .then((verification_check) => console.log(verification_check.status));

      //tokens generation
      // const accessToken = generateAccessToken(user.id);
      // const refreshToken = generateRefreshToken(user.id);
      console.log("manjima", req.phone);
      res.status(200).json({ message: "Manjima vannu" });
    } catch (error) {
      console.error(error);
      throw new Error("Error verifying OTP");
    }
  },

  logout: () => {},
};
