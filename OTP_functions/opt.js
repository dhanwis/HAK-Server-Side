const accountSid = "AC936f4254c82d1f602fdf4abd5efb8943";
const authToken = "[AuthToken]";
const client = require("twilio")(accountSid, authToken);

client.verify.v2
  .services("VA156fe514f42f1df1da47c328b13d67a2")
  .verifications.create({ to: "+919074434030", channel: "sms" })
  .then((verification) => console.log(verification.sid));
