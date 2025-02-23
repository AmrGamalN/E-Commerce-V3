import express, { Request, Response } from "express";
import ReviewController from "../controllers/review.controller";
import AuthenticationMiddleware from "../middlewares/auth.middleware";
import { reviewParser } from "../middlewares/parser.middleware";
import { reviewValidator } from "../validations/review.validator";
import { resultValidator, idValidator } from "../validations/general.validator";
const controller = ReviewController.getInstance();
const router = express.Router();

// Count all reviews by sellerId [ Seller ]  ||
// Count reviews to specific item by sellerId and itemId [ Seller ]
router.get(
  "/count",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  resultValidator,
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
  idValidator,
  resultValidator,
  async (req: Request, res: Response) => {
    await controller.getReviewAverage(req, res);
  }
);

// Add review [ Buyer ]
router.post(
  "/add/:itemId",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  reviewParser,
  idValidator,
  reviewValidator,
  resultValidator,
  async (req: Request, res: Response) => {
    await controller.addReview(req, res);
  }
);

// Update review by buyerId [ Buyer ]
router.put(
  "/update/:reviewId",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  reviewParser,
  reviewValidator,
  idValidator,
  resultValidator,
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
  resultValidator,
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
  resultValidator,
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
