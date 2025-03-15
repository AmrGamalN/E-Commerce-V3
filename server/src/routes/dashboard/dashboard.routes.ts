import express from "express";
import { expressValidator } from "../../middlewares/expressValidator";
import { idValidator } from "../../validations/general.validator";
import { asyncHandler } from "../../middlewares/handleError";
import AuthenticationMiddleware from "../../middlewares/authentication";
import DashboardController from "../../controllers/dashboard/dashboard.controller";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
const controller = DashboardController.getInstance();
const router = express.Router();

// Create dashboard
router.post(
  "/create",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.initializeDashboard.bind(controller))
);

// Get dashboard
router.get(
  "/get",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.getDashboard.bind(controller))
);

// Update total category
router.get(
  "/total-category",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.getTotalCategoryBrandSubCategory.bind(controller))
);

// Rest dashboard
router.post(
  "/reset",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.resetDashboard.bind(controller))
);

// Get dashboard
router.put(
  "/update",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(controller.updateSection.bind(controller))
);

export default router;
