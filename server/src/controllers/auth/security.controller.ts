import { Request, Response } from "express";
import axios from "axios";

class SecurityController {
  private static instance: SecurityController;
  static getInstance(): SecurityController {
    if (!SecurityController.instance) {
      SecurityController.instance = new SecurityController();
    }
    return SecurityController.instance;
  }

  // refresh token
  async refreshToken(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.RefreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "Unauthorized: No refresh token." });
      return;
    }

    // Create new access token
    const response = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`,
      {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }
    );

    if (!response) {
      res.status(403).json({ message: "Invalid or expired refresh token." });
      return;
    }

    const newAccessToken = response.data.id_token;
    res.status(200).json({ accessToken: newAccessToken });
  }
}
export default SecurityController;
