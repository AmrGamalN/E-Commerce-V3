import { Request, Response } from "express";
import { auth } from "../config/firebaseConfig";
import { ZodError } from "zod";
import AuthService from "../services/authService";

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
      const existingUser = await auth.getUserByEmail(email);
      if (existingUser) {
        res.status(409).json({ error: "Email is already registered." });
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

  // When the user clicks on the verification link:
  // It is received in the Frontend interface
  // The oobCode is extracted and the email is verified
  // The uid is sent to your API to update the status

  public async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { uid } = req.query;
      if (!uid) {
        res.status(400).json({ error: "Invalid link please send again" });
        return;
      }

      const existingUser = await auth.getUser(String(uid));
      if (!existingUser) {
        res.status(404).json({ error: "User not found." });
        return;
      }

      if (!existingUser.emailVerified) {
        res.status(400).json({ message: "Email is not verified yet" });
        return;
      }

      await this.serviceInstance.verifyEmail(String(uid));
      res.status(200).json({ message: "Email verified successfully." });
    } catch (error) {}
  }
}

export default AuthController;
