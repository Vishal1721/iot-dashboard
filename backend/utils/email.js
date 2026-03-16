const nodemailer = require("nodemailer");

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"IoT Alert System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    return false;
  }
};

module.exports = sendEmail;
