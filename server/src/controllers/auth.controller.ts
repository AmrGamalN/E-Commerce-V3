import { Request, Response } from "express";
import {
  auth,
  authentication,
  signInWithEmailAndPassword,
} from "../config/firebaseConfig";
import { ZodError } from "zod";
import AuthService from "../services/authService";
import dotenv from "dotenv";
dotenv.config();

class AuthController {
  private static instance: AuthController;
  private serviceInstance: AuthService;

  private constructor() {
    this.serviceInstance = AuthService.getInstance();
  }

  public static getInstance(): AuthController {
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
  public async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, role } = req.body;
      console.log(req.body);
      
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

  // Login user
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      let existingUser;
      try {
        existingUser = await auth.getUserByEmail(email);
      } catch (error: any) {
        res.status(404).json({ error: "User not found." });
        return;
      }

      if (!existingUser.emailVerified) {
        res.status(400).json({ message: "Email is not verified yet" });
        return;
      }

      // Get token and encrypt token and set in cookie
      // prettier-ignore
      const userLogin = await signInWithEmailAndPassword(authentication, email, password);

      const tokenCrypt = Buffer.from(
        await userLogin.user.getIdToken()
      ).toString("base64");

      res.cookie("AuthToken", tokenCrypt, {
        httpOnly: false,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 14 Days
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      await this.serviceInstance.login(userLogin.user.uid);
      res.status(200).json({
        message: "login successfully",
      });
    } catch (error) {
      AuthController.handleError(res, "Failed to login user", error);
    }
  }

  // When the user clicks on the verification link:
  // It is received in the Frontend interface
  // The oobCode is extracted and the email is verified
  // The uid is sent to your API to update the status

  // Verify email
  public async verifyEmail(req: Request, res: Response): Promise<void> {
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

      if (existingUser.emailVerified === true) {
        res.status(200).json({ message: "Email is already verified" });
        return;
      }

      await this.serviceInstance.verifyEmail(String(uid));
      res.status(200).json({ message: "Email verified successfully." });
    } catch (error) {
      AuthController.handleError(res, "Internal server error.", error);
    }
  }
}

export default AuthController;
