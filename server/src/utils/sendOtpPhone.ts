import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendOtpToPhone(mobile: string, otp: string) {
  try {
    await client.messages.create({
      body: `Your OTP for E-Commerce verification is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
}
