const {
  generateAccessToken,
  generateRefreshToken,
} = require("../Constants/jwtTokens");
const customers = require("../Models/Customers/customers");

const dotenv = require("dotenv");
dotenv.config();

const twilioClient = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

//const { fast2sms, generateOTP } = require("../OTP_functions/opt");

module.exports = {
  Otp_login: async (req, res, next) => {
    try {
      const { phoneNumber } = req.body;
      console.log("phone", phoneNumber);

      //const existingPhone = customers.find({ phoneNumber: phoneNumber });

      //console.log("existingPhone", existingPhone);

      // if (existingPhone) {
      //   console.log("user already registered");
      //+16603338075
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

    // try {
    //   const { phoneNumber } = req.body;

    //   const user = await customers.findOne({ phoneNumber });

    //   // generate otp
    //   const otp = generateOTP(4);

    //   console.log(user);

    //   if (user) {
    //     console.log("user is already registered");
    //     user.updateOne({ otp: otp });
    //   }

    //   // save otp to user collection
    //   const userData = await customers.create({
    //     phoneNumber: phoneNumber,
    //     otp: otp,
    //   });

    //   console.log(userData);

    //   await userData.save();

    //   res.status(201).json({
    //     type: "success",
    //     message: "OTP sended to your registered phone number",
    //     data: {
    //       userId: 12345,
    //     },
    //   });

    //   // send otp to phone number
    //   await fast2sms(
    //     {
    //       message: `Manji your  OTP is ${otp}`,
    //       contactNumber: user.phoneNumber,
    //     },
    //     next()
    //   );
    // } catch (error) {
    //   next(error);
    // }
  },

  Otp_verification: async (req, res, next) => {
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

      console.log("manjima", req.phone);
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
