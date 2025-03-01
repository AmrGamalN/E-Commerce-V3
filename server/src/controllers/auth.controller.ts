import { Request, Response } from "express";
import axios from "axios";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";
import {
  auth,
  authentication,
  signInWithEmailAndPassword,
} from "../config/firebaseConfig";
import { ZodError } from "zod";
import AuthService from "../services/authService";
import dotenv from "dotenv";
import User from "../models/mongodb/user.model";
dotenv.config();

class AuthController {
  private static instance: AuthController;
  private serviceInstance: AuthService;

  private constructor() {
    this.serviceInstance = AuthService.getInstance();
  }

  static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  private static handleError(
    res: Response,
    message: string,
    error: unknown,
    status = 400
  ): void {
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map((issue) => {
        {
          code: issue.code;
          message: issue.message;
          path: issue.path.join(".");
        }
      });
      res.status(status).json({ message, errors: formattedErrors });
    } else {
      res.status(status).json({
        message,
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  // Register user
  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, role } = req.body;
      let existingUser = null;
      try {
        existingUser = await auth.getUserByEmail(email);
      } catch (error: any) {
        if (error.code === "auth/user-not-found") {
          existingUser = null;
        } else {
          res.status(500).json({ error: "Error checking user existence" });
          return;
        }
      }

      if (existingUser) {
        res.status(409).json({ message: "Email already exists." });
        return;
      }

      await this.serviceInstance.registerUser(email, password, role, req.body);
      res.status(201).json({
        message: "User registered successfully. Please verify your email.",
      });
    } catch (error) {
      AuthController.handleError(res, "Failed to register user", error);
    }
  }

  // Login user email
  async loginWithEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      let firebaseUser;
      try {
        firebaseUser = await auth.getUserByEmail(email);
      } catch {
        res.status(404).json({ error: "User not found." });
        return;
      }

      if (!firebaseUser.emailVerified) {
        res.status(400).json({ message: "Email is not verified yet" });
        return;
      }

      const userLogin = await signInWithEmailAndPassword(
        authentication,
        email,
        password
      );
      // const accessToken = await userLogin.user.getIdToken();
      const refreshToken = userLogin.user.refreshToken;

      // Check if user signIn  two factor authentication
      const user = await User.findOne({ email: email });
      if (user?.isTwoFactorAuth === true) {
        res
          .status(200)
          .json({
            message: "2FA required",
            userId: user.userId,
            refreshToken: refreshToken,
          });
        return;
      }

      // Generate refresh token in cookies
      generateToken(res, userLogin.user, "email", refreshToken);
      res.status(200).json({ message: "Login successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to login user", details: error });
    }
  }

  // Login user with phone
  async loginWithPhone(req: Request, res: Response): Promise<void> {
    try {
      const { mobile, password } = req.body;

      let firebaseUser;
      try {
        firebaseUser = await auth.getUserByPhoneNumber(mobile);
      } catch {
        res.status(404).json({ error: "User not found." });
        return;
      }

      const userLogin = await this.serviceInstance.loginWithPhone(mobile);
      if (!userLogin) {
        res.status(404).json({ error: "User not found." });
        return;
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        userLogin.password
      );
      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      generateToken(res, userLogin, "phone");
      res.status(200).json({ message: "Login successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to login user", details: error });
    }
  }

  // When the user clicks on the verification link:
  // It is received in the Frontend interface
  // The oobCode is extracted and the email is verified
  // The uid is sent to your API to update the status

  // Verify email
  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { uid } = req.body;
      if (!uid) {
        res.status(400).json({ error: "Invalid link please send again" });
        return;
      }

      let existingUser;
      try {
        existingUser = await auth.getUser(uid);
      } catch (error: any) {
        res.status(404).json({ error: "User not found." });
        return;
      }

      if (existingUser.emailVerified) {
        res.status(200).json({ message: "Email is already verified" });
        return;
      }

      try {
        await this.serviceInstance.verifyEmail(String(uid));
        res.status(200).json({ message: "Email verified successfully." });
        return;
      } catch (error) {
        res.status(500).json({ error: "Email verification failed" });
      }
    } catch (error) {
      AuthController.handleError(res, "Internal server error.", error);
    }
  }

  // refresh token
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
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
    } catch (error) {
      AuthController.handleError(res, "Error refreshing token.", error);
    }
  }

  // Logout
  async logOut(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.user_id;
      res.clearCookie("RefreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Revoke refreshToken from firebase
      if (userId) {
        await auth.revokeRefreshTokens(userId);
      }

      res.status(200).json({
        message: "Logged out successfully, clear access token from frontend.",
      });
    } catch (error) {
      AuthController.handleError(res, "Error during logout.", error);
    }
  }
}
export default AuthController;
