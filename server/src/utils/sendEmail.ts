import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.HOST_NODE_MAILER,
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_NODE_MAILER,
    pass: process.env.PASS_NODE_MAILER,
  },
});

const sendVerificationEmail = async (
  email: string,
  link: string,
  subject: string,
  text: string
): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: process.env.USER_NODE_MAILER,
      to: email,
      subject: subject,
      text: link != "" ? `${text} ${link}` : text,
      html:
        link != ""
          ? `<p>Click the link below to verify your email:</p>
      <a href="${link}">${link}</a>`
          : "",
    });
    return true;
  } catch (error) {
    return false;
  }
};

export { sendVerificationEmail };
