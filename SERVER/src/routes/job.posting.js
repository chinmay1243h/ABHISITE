const nodemailer = require("nodemailer");
const { prepareBody, prepareResponse } = require("../utils/response");
const router = require("express").Router();
require("dotenv").config();

router.post("/send-email", prepareBody, async (req, res) => {
  const {
    name,
    email,
    phone,
    dob,
    address,
    position,
    qualification,
    experience,
    skills,
    startDate,
    expectedSalary,
    coverLetter,
    resume,
  } = req.body;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: "milankumar.xd@gmail.comn",
    subject: "Job Application Submission",
    html: `
        <h3>Job Application Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date of Birth:</strong> ${dob}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Position Applied:</strong> ${position}</p>
        <p><strong>Qualification:</strong> ${qualification}</p>
        <p><strong>Experience:</strong> ${experience}</p>
        <p><strong>Skills:</strong> ${skills}</p>
        <p><strong>Availability to Start:</strong> ${startDate}</p>
        <p><strong>Expected Salary:</strong> ${expectedSalary}</p>
        <p><strong>Cover Letter:</strong> ${coverLetter}</p>
        <p><strong>Resume:</strong> ${resume || "No file uploaded"}</p>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json(prepareResponse("OK", "Mail send sucessfully", null, null));
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
});

module.exports = router;
