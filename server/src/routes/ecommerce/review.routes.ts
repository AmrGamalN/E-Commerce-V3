import express from "express";
import ReviewController from "../../controllers/ecommerce/review.controller";
import AuthenticationMiddleware from "../../middlewares/authentication";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
import { reviewAddValidator } from "../../validations/ecommerce/review.validator";
import { idValidator } from "../../validations/general.validator";
import { expressValidator } from "../../middlewares/expressValidator";
import { validatorBody } from "../../middlewares/zodValidator";
import { ReviewAddDto } from "../../dto/ecommerce/review.dto";
import { asyncHandler } from "../../middlewares/handleError";

const controller = ReviewController.getInstance();
const router = express.Router();

// Count all reviews by sellerId [ Seller ]  ||
// Count reviews to specific item by sellerId and itemId [ Seller ]
router.get(
  "/count",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  asyncHandler(controller.countReview.bind(controller))
);

// Get average
// Allow both userId and itemId as optional parameters
router.get(
  "/average-rate",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  asyncHandler(controller.getReviewAverage.bind(controller))
);

// Add review [ Buyer ]
router.post(
  "/add/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  validatorBody(ReviewAddDto),
  asyncHandler(controller.addReview.bind(controller))
);

// Update review by buyerId [ Buyer ]
router.put(
  "/update/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  reviewAddValidator,
  idValidator,
  expressValidator,
  validatorBody(ReviewAddDto),
  asyncHandler(controller.updateReview.bind(controller))
);

// Delete review by buyerId  [ Buyer ]
router.delete(
  "/delete",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.deleteReview.bind(controller))
);

// Get Review by reviewId and userId [ Seller ]
router.get(
  "/get",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.getReview.bind(controller))
);

// Get all review by reviewId and sellerId [ Seller ]
router.get(
  "/get-all",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  asyncHandler(controller.getAllReview.bind(controller))
);

export default router;
