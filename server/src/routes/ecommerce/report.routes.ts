import express from "express";
import ReportController from "../../controllers/ecommerce/report.controller";
import AuthenticationMiddleware from "../../middlewares/authentication";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
import { expressValidator } from "../../middlewares/expressValidator";
import { idValidator } from "../../validations/general.validator";
import {
  reportAddValidator,
  reportUpdateValidator,
  reportFeedBackValidator,
  updateReportStatusValidator,
} from "../../validations/ecommerce/report.validator";
import {
  ReportAddDto,
  ReportUpdateDto,
  ReportFeedBackDto,
} from "../../dto/ecommerce/report.dto";
import { validatorBody } from "../../middlewares/zodValidator";
import { asyncHandler } from "../../middlewares/handleError";

const controller = ReportController.getInstance();
const router = express.Router();

// Count report
router.get(
  "/count",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.countReport.bind(controller))
);

// Add report
router.post(
  "/add",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  reportAddValidator,
  expressValidator,
  validatorBody(ReportAddDto),
  asyncHandler(controller.addReport.bind(controller))
);

// Update report
router.put(
  "/update",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  reportUpdateValidator,
  expressValidator,
  validatorBody(ReportUpdateDto),
  asyncHandler(controller.updateReport.bind(controller))
);

// Update report status
router.put(
  "/update/status",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  updateReportStatusValidator,
  expressValidator,
  asyncHandler(controller.updateReportStatus.bind(controller))
);

// feedback report
router.put(
  "/feedback",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  reportFeedBackValidator,
  expressValidator,
  validatorBody(ReportFeedBackDto),
  asyncHandler(controller.feedBackReport.bind(controller))
);

// Delete report
router.delete(
  "/delete/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.deleteReport.bind(controller))
);

// Get report
router.get(
  "/get/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.getReport.bind(controller))
);

// Get all report
router.get(
  "/get-all",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(controller.getAllReport.bind(controller))
);

export default router;
