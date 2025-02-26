import express, { Request, Response, NextFunction } from "express";
import AuthController from "../controllers/auth.controller";
import {
  loginValidator,
  registerValidator,
} from "../validations/auth.validator";
import { uploadFile, upload } from "../middlewares/uploadFile.middleware";
import { userRegisterParser } from "../middlewares/parser.middleware";
import { validatorBody } from "../middlewares/zod.validator.middleware";
import { expressValidator } from "../middlewares/express.validator.middleware";
import { RegisterDto, LoginDto } from "../dto/auth.dto";
import AuthenticationMiddleware from "../middlewares/auth.middleware";
const controller = AuthController.getInstance();
const router = express.Router();

// Register user
router.post(
  "/register",
  uploadFile(
    upload.fields([
      { maxCount: 1, name: "profileImage" },
      { maxCount: 1, name: "coverImage" },
    ])
  ),
  userRegisterParser,
  registerValidator,
  expressValidator,
  validatorBody(RegisterDto),
  async (req: Request, res: Response, next: NextFunction) => {
    await controller.registerUser(req, res);
  }
);

// Login user
router.post(
  "/login",
  loginValidator,
  expressValidator,
  validatorBody(LoginDto),
  async (req: Request, res: Response) => {
    await controller.login(req, res);
  }
);

// Verify email
router.get("/verify-email", async (req: Request, res: Response) => {
  await controller.verifyEmail(req, res);
});

// refresh token
router.post(
  "/refresh-token",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  async (req: Request, res: Response) => {
    await controller.refreshToken(req, res);
  }
);

// Logout
router.post(
  "/Logout",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  async (req: Request, res: Response) => {
    await controller.logOut(req, res);
  }
);

export default router;
