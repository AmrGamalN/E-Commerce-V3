import express from "express";
import ReportController from "../controllers/report.controller";
import AuthenticationMiddleware from "../middlewares/authentication";
import { expressValidator } from "../middlewares/expressValidator";
import { idValidator } from "../validations/general.validator";
import {
  reportAddValidator,
  reportUpdateValidator,
  reportFeedBackValidator,
} from "../validations/report.validator";
import {
  ReportAddDto,
  ReportUpdateDto,
  ReportFeedBackDto,
} from "../dto/report.dto";
import { validatorBody } from "../middlewares/zodValidator";
import { asyncHandler } from "../middlewares/handleError";

const controller = ReportController.getInstance();
const router = express.Router();

// Count report
router.get(
  "/count",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.countReport.bind(controller))
);

// Add report
router.post(
  "/add",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  reportAddValidator,
  expressValidator,
  validatorBody(ReportAddDto),
  asyncHandler(controller.addReport.bind(controller))
);

// Update report
router.put(
  "/update",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  reportUpdateValidator,
  expressValidator,
  validatorBody(ReportUpdateDto),
  asyncHandler(controller.updateReport.bind(controller))
);

// feedback report
router.put(
  "/feedback",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  reportFeedBackValidator,
  expressValidator,
  validatorBody(ReportFeedBackDto),
  asyncHandler(controller.feedBackReport.bind(controller))
);

// Delete report
router.delete(
  "/delete/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator
);

// Get report
router.get(
  "/get/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.getReport.bind(controller))
);

// Get all report
router.get(
  "/get-all",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(controller.getAllReport.bind(controller))
);

export default router;
