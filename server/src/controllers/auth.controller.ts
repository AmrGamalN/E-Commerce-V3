import { Request, Response } from "express";
import axios from "axios";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.utils";
import {
  auth,
  authentication,
  signInWithEmailAndPassword,
} from "../config/firebaseConfig";
import AuthService from "../services/auth.service";
import dotenv from "dotenv";
import User from "../models/mongodb/user.model";
import { UserDtoType } from "../dto/user.dto";

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

  // Register user
  async registerUser(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    // check user is existed in firebase or not
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

    await this.serviceInstance.registerUser(req.body);
    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
    });
  }

  // Login user with email
  async loginWithEmail(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    // Find the user in the database
    const existingUser = await User.findOne({ email })
      .select([
        "email",
        "isTwoFactorAuth",
        "userId",
        "numberLogin",
        "lastFailedLoginTime",
      ])
      .lean();

    if (!existingUser) {
      res.status(404).json({ error: "User not found in database." });
      return;
    }

    // Check if the user has reached the max failed attempts
    const isBlocked = await this.checkAttemptsLogin(existingUser, res);
    if (isBlocked == true) return;

    // Retrieve user from Firebase Authentication by [ email ]
    let firebaseUser;
    try {
      firebaseUser = await auth.getUserByEmail(email);
    } catch {
      res.status(404).json({ error: "User not found in Firebase." });
      return;
    }

    // Check if the user's email is verified
    if (!firebaseUser.emailVerified) {
      res.status(400).json({ message: "Email is not verified yet." });
      return;
    }

    // Authenticate the user using Firebase Authentication
    const firebaseAuthResponse = await this.firebaseAuthenticate(
      existingUser,
      res,
      email,
      password
    );
    if (!firebaseAuthResponse) return;

    // Get the refresh token from Firebase authentication response
    // const accessToken = await firebaseAuthResponse.user.getIdToken();
    const userRefreshToken = firebaseAuthResponse.user.refreshToken;

    // Check if Two-Factor Authentication (2FA) is enabled
    if (existingUser.isTwoFactorAuth) {
      res.status(200).json({
        message: "2FA required",
        userId: existingUser.userId,
        refreshToken: userRefreshToken,
      });
      return;
    }

    // Generate and store the refresh token in cookies
    generateToken(res, firebaseAuthResponse.user, "email", userRefreshToken);

    res.status(200).json({
      message: "Login successful",
      userId: existingUser.userId,
    });
  }

  // Login user with phone
  async loginWithPhone(req: Request, res: Response): Promise<void> {
    const { mobile, password } = req.body;

    // Retrieve user from Firebase Authentication
    try {
      const firebaseUser = await auth.getUserByPhoneNumber(mobile);
    } catch (error) {
      res.status(404).json({ error: "User not found.", details: error });
      return;
    }

    // Find the user in the database
    const retrievedUser = await this.serviceInstance.loginWithPhone(mobile);
    if (!retrievedUser) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    // Check if the user has reached the max failed attempts
    const isBlocked = await this.checkAttemptsLogin(retrievedUser, res);
    if (isBlocked == true) return;

    const isPasswordValid = await bcrypt.compare(
      password,
      retrievedUser.password
    );
    if (!isPasswordValid) {
      // Used to check the number of failed login attempts
      const failedAttempts = retrievedUser.numberLogin + 1;
      await User.updateOne(
        { mobile },
        {
          $set: {
            numberLogin: failedAttempts,
            lastFailedLoginTime: new Date().toISOString(),
          },
        }
      );
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    generateToken(res, retrievedUser, "phone");
    res.status(200).json({ message: "Login successfully" });
  }

  // Used to check the number of failed login attempts
  // Used to avoid brute force attack
  private async checkAttemptsLogin(
    existingUser: UserDtoType,
    res: Response
  ): Promise<boolean> {
    if (existingUser.numberLogin >= 3) {
      const currentTime = Date.now();
      const lastFailedTime = new Date(
        existingUser.lastFailedLoginTime as Date
      ).getTime();
      const timeDifference = (currentTime - lastFailedTime) / (1000 * 60);

      if (timeDifference < 10) {
        const remainingTime = Math.ceil(10 - timeDifference);
        res.status(400).json({
          message: `Your account is temporarily locked due to multiple failed login attempts. Please try again in ${remainingTime} minutes or reset your password.`,
          remainingTime: remainingTime,
        });
        return true;
      }

      // Reset failed login attempts after 10 minutes
      await User.updateOne(
        { email: existingUser.email },
        { $set: { numberLogin: 0, lastFailedLogin: null } }
      );
    }
    return false;
  }

  // Authenticate the user using Firebase Authentication to email & update number attempts login
  private async firebaseAuthenticate(
    existingUser: UserDtoType,
    res: Response,
    email: string,
    password: string
  ): Promise<any> {
    let firebaseAuthResponse;
    try {
      firebaseAuthResponse = await signInWithEmailAndPassword(
        authentication,
        email,
        password
      );
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        const failedAttempts = existingUser.numberLogin + 1;
        await User.updateOne(
          { email },
          {
            $set: {
              numberLogin: failedAttempts,
              lastFailedLoginTime: new Date().toISOString(),
            },
          }
        );

        res.status(400).json({ error: "Invalid email or password." });
        return;
      }
    }
    return firebaseAuthResponse;
  }

  // When the user clicks on the verification link:
  // It is received in the Frontend interface
  // The oobCode is extracted and the email is verified
  // The uid is sent to your API to update the status

  // Verify email
  async verifyEmail(req: Request, res: Response): Promise<void> {
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

  // Logout
  async logOut(req: Request, res: Response): Promise<void> {
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
  }
}
export default AuthController;
