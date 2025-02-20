import express, { Request, Response } from "express";
import AuthController from "../controllers/auth.controller";
const controller = AuthController.getInstance();
const router = express.Router();

// Register a new user
router.post("/register", async (req: Request, res: Response) => {
  await controller.registerUser(req, res);
});

// Login user
router.post("/login", async (req: Request, res: Response) => {
  await controller.login(req, res);
});

// Register a new user
router.get("/verify-email", async (req: Request, res: Response) => {
  await controller.verifyEmail(req, res);
});

export default router;
