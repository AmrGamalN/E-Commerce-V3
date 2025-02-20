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
      const user = await this.serviceInstance.registerUser(
        email,
        password,
        role,
        req.body
      );
      res
        .status(201)
        .json({ message: "User registered successfully. Please log in." });
    } catch (error) {
      AuthController.handleError(res, "Failed to register user", error);
    }
  }
}

export default AuthController;
