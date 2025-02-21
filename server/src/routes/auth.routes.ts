import express, { Request, Response, NextFunction } from "express";
import AuthController from "../controllers/auth.controller";
import { loginValid, registerValid } from "../validations/auth.valid";
import { validatorResult } from "../validations/validationResult.valid";
import { uploadFile, upload } from "../middlewares/uploadFile.middleware";
import { parser } from "../middlewares/parser.middleware";
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
  parser,
  registerValid,
  validatorResult,
  async (req: Request, res: Response, next: NextFunction) => {
    await controller.registerUser(req, res);
  }
);

// Login user
router.post(
  "/login",
  loginValid,
  validatorResult,
  async (req: Request, res: Response) => {
    await controller.login(req, res);
  }
);

// Verify email
router.get("/verify-email", async (req: Request, res: Response) => {
  await controller.verifyEmail(req, res);
});

export default router;
