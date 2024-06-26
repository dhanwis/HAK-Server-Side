// Import the Nodemailer library
const nodemailer = require("nodemailer");

// Create a transporter using SMTP transport
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "muhammedshamalpv@gmail.com",
    pass: '1252552222',
  },
});

// Email data
const mailOptions = {
  from: "muhammedshamalpv@gmail.com",
  to: "shajushajahan2001@gmail.com",
  subject: "Node.js Email Tutorial",
  text: "This is a basic email sent from Node.js using Nodemailer.",
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending email:", error);
  } else {
    console.log("Email sent:", info.response);
  }
});
