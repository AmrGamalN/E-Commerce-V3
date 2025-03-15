import express from "express";
import { expressValidator } from "../../middlewares/expressValidator";
import { idValidator } from "../../validations/general.validator";
import { asyncHandler } from "../../middlewares/handleError";
import AuthenticationMiddleware from "../../middlewares/authentication";
import scheduleDashboard from "../../controllers/dashboard/scheduleDashboard.controller";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
const controller = scheduleDashboard.getInstance();
const router = express.Router();

  // Used to start and stop all jobs
router.post(
  "/manage-all",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.manageAllJobs.bind(controller))
);

  // Start or stop a specific scheduled job
router.post(
  "/manage-one",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.manageJob.bind(controller))
);

export default router;
