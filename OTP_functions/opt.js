const twilioClient = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports.sendOTP = async (phoneNumber) => {
  try {
    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: phoneNumber, channel: "sms" });
    return verification.sid;
  } catch (error) {
    console.error(error);
    throw new Error("Error sending OTP");
  }
};

module.exports.verifyOTP = async (verificationSid, code) => {
  try {
    const verificationCheck = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications(verificationSid)
      .check({ code });
    return verificationCheck.status === "approved";
  } catch (error) {
    console.error(error);
    throw new Error("Error verifying OTP");
  }
};
