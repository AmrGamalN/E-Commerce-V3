import express, { Request, Response, NextFunction } from "express";
import AuthController from "../controllers/auth.controller";
import { loginValidator, registerValidator } from "../validations/auth.valid";
import { resultValidator } from "../validations/general.valid";
import { uploadFile, upload } from "../middlewares/uploadFile.middleware";
import { userParser } from "../middlewares/parser.middleware";
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
  userParser,
  registerValidator,
  resultValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    await controller.registerUser(req, res);
  }
);

// Login user
router.post(
  "/login",
  loginValidator,
  resultValidator,
  async (req: Request, res: Response) => {
    await controller.login(req, res);
  }
);

// Verify email
router.get("/verify-email", async (req: Request, res: Response) => {
  await controller.verifyEmail(req, res);
});

export default router;
