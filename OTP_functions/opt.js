const fast2sms = require("fast-two-sms");
//const {FAST2SMS} = require("../config");

exports.generateOTP = (otp_length) => {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

exports.fast2sms = async ({ message, contactNumber }, next) => {
  try {
    const res = await fast2sms.sendMessage({
      authorization: process.env.FAST_TWO_SMS,
      message,
      numbers: [contactNumber],
    });
    console.log("res", res);
  } catch (error) {
    next(error);
  }
};





 

var options = {
    'method': 'POST',
    'hostname': 'k2ggkn.api.infobip.com',
    'path': '/2fa/2/applications',
    'headers': {
        'Authorization': 'App 632a92a8dfa46230c52a204513c5d0f9-7221d250-89c0-40ce-84c5-38f979b898b6',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    'maxRedirects': 20
};

var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
    });

    res.on("error", function (error) {
        console.error(error);
    });
});

var postData = JSON.stringify({
    "name": "2fa test application",
    "enabled": true,
    "configuration": {
        "pinAttempts": 10,
        "allowMultiplePinVerifications": true,
        "pinTimeToLive": "15m",
        "verifyPinLimit": "1/3s",
        "sendPinPerApplicationLimit": "100/1d",
        "sendPinPerPhoneNumberLimit": "10/1d"
    }
});

req.write(postData);

req.end();