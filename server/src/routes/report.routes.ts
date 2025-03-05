import express, { Request, Response } from "express";
import ReportController from "../controllers/report.controller";
import AuthenticationMiddleware from "../middlewares/auth.middleware";
import { expressValidator } from "../middlewares/express.validator.middleware";
import { idValidator } from "../validations/general.validator";
import { reportValidator } from "../validations/report.validator";

const controller = ReportController.getInstance();
const router = express.Router();

// Add message
router.post(
  "/add",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  reportValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.addReport(req, res);
  }
);

export default router;
