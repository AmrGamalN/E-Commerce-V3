import { Request, Response } from "express";
import AuthService from "../../services/auth/authMain.service";
const authService = AuthService.getInstance();
const securityService = authService.getSecurityService();
const registerInstance = authService.getRegisterService();

class RegisterController {
  private static instance: RegisterController;
  static getInstance(): RegisterController {
    if (!RegisterController.instance) {
      RegisterController.instance = new RegisterController();
    }
    return RegisterController.instance;
  }

  // Main register
  private async registerUser(
    typeRegister: "email" | "phone",
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const existingUser = await securityService.findUserInFirebase(
        req.body,
        typeRegister
      );
      if (existingUser) {
        res.status(409).json({ message: `${typeRegister} already exists.` });
        return;
      }
      await registerInstance.registerUser(typeRegister, req.body);
      res.status(201).json({
        message: `User registered successfully. Please verify your ${typeRegister}.`,
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Registration error",
      });
    }
  }

  // Register by email
  async registerByEmail(req: Request, res: Response): Promise<void> {
    await this.registerUser("email", req, res);
  }

  // Register by phone
  async registerByPhone(req: Request, res: Response): Promise<void> {
    await this.registerUser("phone", req, res);
  }
}
export default RegisterController;
