// const twilioClient = require("twilio")(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

const dotenv = require("dotenv");
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

module.exports = {
  login: async (req, res) => {
    try {
      const { phoneNumber } = req.body; // Access data sent in the request body

      client.verify.v2
        .services("VA5f393ba5eb181ecba3d7ae3dab69a64b")
        .verifications.create({ to: `+91${phoneNumber}`, channel: "sms" })
        .then((verification) => console.log(verification.sid))
        .catch((error) => {
          console.error("Error sending OTP:", error);
          res.status(500).json({ error: "Failed to send OTP" });
        });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  },

  logout: () => {},
};
