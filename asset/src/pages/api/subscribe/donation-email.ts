"use server";
import { NextApiRequest, NextApiResponse } from "next";
import nodemailer, { Transporter } from "nodemailer";

const host = process.env.EMAIL_HOST;
const pass = process.env.EMAIL_PASS;
const user = process.env.EMAIL_USER;

// Cleaned and styled HTML email template
const generateDonationTemplate = (
  name: string,
  message: string,
  link?: string,
  subject?: string
) => `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${subject}</title>
    <style>
      body {
        background-color: #212122;
        padding: 30px;
        font-family: "Roboto", sans-serif;
        color: #fff;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #16213e;
        padding: 20px;
        border-radius: 3px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo img {
        width: auto;
        height: auto;
        max-width: 300px;
      }
      h1 {
        font-size: 28px;
        text-align: center;
        color: #fff;
        padding: 15px;
        margin-bottom: 30px;
        font-weight: bold;
        letter-spacing: 1.5px;
      }
      h1 span {
        background: rgb(16, 14, 14);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      p {
        font-size: 18px;
        line-height: 1.6;
        color: #a8dadc;
      }
      a.btn {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        color: #fff;
        background-color:rgb(132, 233, 69);
        border-radius: 3px;
        text-decoration: none;
      }
      .footer {
        margin-top: 30px;
        text-align: center;
        font-size: 14px;
        color: #457b9d;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img
          src="https://res.cloudinary.com/dgbopjzbu/image/upload/v1749780489/output-onlinepngtools_pcklfn.png"
          alt="G-OMM Logo"
        />
      </div>
      <h1><span>God is Good!</span></h1>
      <p>Dear ${name},</p>
      <p>${message}</p>
      ${link ? `<p><a href="${link}" class="btn">Visit Website</a></p>` : ""}
      <div class="footer">
        <p>In His Service,</p>
        <p><strong>Global Onesmos Missionary Movement</strong></p>
        <p>Spreading God's Love Worldwide</p>
      </div>
      <p><em>P.S. God is Good – Let’s share His light together!</em></p>
    </div>
  </body>
</html>
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { names, emails, subject, message, link } = req.body;

    // Validate input
    if (
      !Array.isArray(names) ||
      !Array.isArray(emails) ||
      names.length !== emails.length
    ) {
      return res.status(400).json({
        error: "Names and emails must be arrays of the same length.",
      });
    }
    if (!subject || !message) {
      return res
        .status(400)
        .json({ error: "Subject and message are required." });
    }

    const transporter: Transporter = nodemailer.createTransport({
      host: host,
      port: 587,
      auth: {
        user: user,
        pass: pass,
      },
    });

    await transporter.verify();

    // Send all donation emails
    const emailPromises = emails.map((email: string, index: number) => {
      const name = names[index] || "Beloved";
      const htmlContent = generateDonationTemplate(
        name,
        message,
        link,
        subject
      );

      return transporter.sendMail({
        from: '"Global Onesmos Missionary Movement" <info@g-omm.com>',
        to: email,
        replyTo: "support@g-omm.com",
        subject,
        html: htmlContent,
      });
    });

    await Promise.all(emailPromises);

    return res
      .status(200)
      .json({ message: "Donation emails sent successfully" });
  } catch (error) {
    console.error("Error sending donation emails:", error);
    return res.status(500).json({ error: "Failed to send donation emails" });
  }
}
