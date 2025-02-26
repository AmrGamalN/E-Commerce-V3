import express, { Request, Response } from "express";
import ReviewController from "../controllers/review.controller";
import AuthenticationMiddleware from "../middlewares/auth.middleware";
import { reviewParser } from "../middlewares/parser.middleware";
import { reviewValidator } from "../validations/review.validator";
import { idValidator } from "../validations/general.validator";
import { expressValidator } from "../middlewares/express.validator.middleware";
import { validatorBody } from "../middlewares/zod.validator.middleware";
import { ReviewAddDto } from "../dto/review.dto";

const controller = ReviewController.getInstance();
const router = express.Router();

// Count all reviews by sellerId [ Seller ]  ||
// Count reviews to specific item by sellerId and itemId [ Seller ]
router.get(
  "/count",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    await controller.countReview(req, res);
  }
);

// Get average
// Allow both userId and itemId as optional parameters
router.get(
  "/average-rate",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    await controller.getReviewAverage(req, res);
  }
);

// Add review [ Buyer ]
router.post(
  "/add/:id",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  reviewParser,
  idValidator,
  expressValidator,
  validatorBody(ReviewAddDto),
  async (req: Request, res: Response) => {
    await controller.addReview(req, res);
  }
);

// Update review by buyerId [ Buyer ]
router.put(
  "/update/:id",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  reviewParser,
  reviewValidator,
  idValidator,
  expressValidator,
  validatorBody(ReviewAddDto),
  async (req: Request, res: Response) => {
    await controller.updateReview(req, res);
  }
);

// Delete review by buyerId  [ Buyer ]
router.delete(
  "/delete",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.deleteReview(req, res);
  }
);

// Get Review by reviewId and userId [ Seller ]
router.get(
  "/get",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.getReview(req, res);
  }
);

// Get all review by reviewId and sellerId [ Seller ]
router.get(
  "/get-all",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    await controller.getAllReview(req, res);
  }
);

export default router;
