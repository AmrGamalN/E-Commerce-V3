import { Request, Response } from "express";
import ReviewService from "../../services/ecommerce/review.service";

class ReviewController {
  private static Instance: ReviewController;
  private serviceInstance: ReviewService;
  constructor() {
    this.serviceInstance = ReviewService.getInstance();
  }

  public static getInstance(): ReviewController {
    if (!ReviewController.Instance) {
      ReviewController.Instance = new ReviewController();
    }
    return ReviewController.Instance;
  }

  /**
   * Add a new review for item.
   *
   * @request
   * @property {Object} req.body         - The review details.
   * @property {string} req.user.user_id - The buyer ID (retrieved from token).
   * @property {string} req.params.id    - The ID of the item being reviewed.
   *
   * @response
   *   - 200 OK:                    { message: "Review added successfully" }
   *   - 400 Bad Request:           { message: "Failed to add review" }
   *   - 500 Internal Server Error: { message: "Failed to add review", error: error details }
   *
   * @description
   *   - A buyer can submit a review for an item.
   */
  async addReview(req: Request, res: Response): Promise<void> {
    const buyerId = req.user?.user_id;
    const buyerName = req.user?.name;
    const { id } = req.params;
    const retrievedReview = await this.serviceInstance.addReview(
      req.body,
      buyerId,
      buyerName,
      String(id)
    );
    if (!retrievedReview) {
      res.status(400).json({ message: "Failed to add review" });
      return;
    }
    res.status(200).json({ message: "Review added Successfully" });
  }

  /**
   * Retrieve review based on provided parameters.
   *
   * @request
   * @property {string} req.body.reviewId  - The ID of a specific item (optional).
   * @property {string} req.body.userId    - The ID of the user (used by admins).
   * @property {string} req.user.user_id   - The seller ID (retrieved from token).
   *
   * @response
   *   - 200 OK:                    { message: "Reviews retrieved successfully", data: Array of reviews }
   *   - 404 Not Found:             { message: "No reviews found", data: [] }
   *   - 500 Internal Server Error: { message: "Failed to get items", error: error details }
   *
   * @description
   *   - Seller can retrieve review related to their item using `sellerId , reviewId`.
   *   - Admin can retrieve review for a specific user using `userId , reviewId`.
   */
  async getReview(req: Request, res: Response): Promise<void> {
    const { userId, reviewId } = req.body;
    const sellerId = userId ? userId : req.user?.user_id;
    const retrievedReview = await this.serviceInstance.getReview(
      String(reviewId),
      sellerId
    );
    if (retrievedReview == null) {
      res.status(404).json({ message: "Not found review", data: [] });
      return;
    }
    res
      .status(200)
      .json({ message: "Review get Successfully", data: retrievedReview });
  }

  /**
   * Retrieves reviews based on provided parameters.
   *
   * @request
   * @property {number} req.query.page   - The page number for pagination.
   * @property {string} req.body.itemId  - The ID of a specific item (optional).
   * @property {string} req.body.userId  - The ID of the user (used by admins).
   * @property {string} req.user.user_id - The seller ID (retrieved from token).
   *
   * @response
   *   - 200 OK:                    { paginationInfo: {}, message: "Reviews retrieved successfully", data: Array of reviews }
   *   - 200 OK:                    { message: "Not found reviews", data: [] }
   *   - 500 Internal Server Error: { message: "Failed to get items", error: error details }
   *
   * @description
   *   - Seller can retrieve all reviews related to their items using `sellerId`.
   *   - Admin can retrieve reviews for a specific user using `userId`.
   */
  async getAllReview(req: Request, res: Response): Promise<void> {
    const { page } = req.query;
    const { itemId, userId } = req.body;
    const sellerId = userId ? userId : req.user?.user_id;
    const retrievedReviews = await this.serviceInstance.getAllReview(
      sellerId,
      Number(page)
    );

    const count = await this.serviceInstance.countReview(sellerId, itemId);
    if (retrievedReviews.length == 0) {
      res.status(200).json({ message: "Not found reviews", data: [] });
      return;
    }

    const totalPages = Math.ceil(count / 10);
    const remainPages = totalPages - Number(page);
    res.status(200).json({
      paginationInfo: {
        currentPage: Number(page),
        totalPages: totalPages,
        totalReviews: count,
        remainPages: remainPages > 0 ? remainPages : 0,
        itemsPerPage: 10,
      },
      message: "Reviews get Successfully",
      data: retrievedReviews,
    });
  }

  /**
   * Update review.
   *
   * @request
   * @property {string} req.body.reviewId - The ID of review
   * @property {string} req.token.buyerId   - The ID of the seller (retrieved from token).
   *
   * @response
   *   - 200 OK:                    { message: "Review updated Successfully", data: review updated }
   *   - 404 Not Found:             { message: "No reviews found", data: [] }
   *   - 500 Internal Server Error: { message: "Failed to update review", error: error details }
   *
   * @description
   *   - Update review for item by a buyer
   */
  async updateReview(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const buyerId = req.user?.user_id;
    const updatedReview = await this.serviceInstance.updateReview(
      String(id),
      buyerId,
      req.body
    );
    if (!updatedReview) {
      res.status(404).json(updatedReview);
      return;
    }
    res.status(200).json(updatedReview);
  }

  /**
   * Retrieves the count review  based on the given parameters.
   *
   * @request
   * @property {string} req.body.itemId    - The ID of the specific item (used by sellers & admins for count).
   * @property {string} req.body.userId    - The ID of the user (used by admins for count).
   * @property {string} req.token.sellerId - The ID of the seller (retrieved from token).
   *
   * @response
   *   - 200 OK:                    { message: "Reviews counted successfully", count: review count }
   *   - 404 Not Found:             { message: "No reviews found", count: 0 }
   *   - 500 Internal Server Error: { message: "Failed to fetch count review", error: error details }
   *
   * @description
   *   - Counts reviews for all items by a seller (by sellerId).
   *   - Counts reviews for a specific item by a seller (by sellerId & itemId).
   *   - Counts reviews for all items reviewed by a specific user (by userId) [Admin Only].
   *   - Counts reviews for a specific item reviewed by a specific user (by userId & itemId) [Admin Only].
   */
  async countReview(req: Request, res: Response): Promise<void> {
    const { itemId, userId } = req.body;
    const sellerId = userId ? userId : req.user?.user_id;
    const count = await this.serviceInstance.countReview(sellerId, itemId);
    if (count == 0) {
      res.status(404).json({ message: "Not found reviews", data: 0 });
      return;
    }
    res.status(200).json({
      message: "Count review fetched successfully",
      data: count,
    });
  }

  /**
   * Deletes a review based on the provided parameters.
   *
   * @request
   * @property {string} req.body.reviewId - The ID of the review to be deleted.
   * @property {string} req.user.user_id    - The ID of the buyer (if deleting their own review).
   *
   * @response
   *   - 200 OK:                    { message: "Review deleted successfully", data: [] }
   *   - 404 Not Found:             { message: "Review not found", data: [] }
   *   - 500 Internal Server Error: { message: "Failed to delete review", error: error details }
   *
   * @description
   *   - A buyer can delete their own review using `buyerId` and `reviewId`.
   *   - An admin can delete any review using `reviewId` only.
   */
  async deleteReview(req: Request, res: Response): Promise<void> {
    const { reviewId } = req.body;
    const sellerId = req.user?.user_id;
    const retrievedReview = await this.serviceInstance.deleteReview(
      String(reviewId),
      sellerId
    );
    if (!retrievedReview) {
      res.status(404).json(retrievedReview);
      return;
    }
    res.status(200).json(retrievedReview);
  }

  /**
   * Retrieves the average review ratings based on the given parameters.
   *
   * @request
   * @property {string} req.body.itemId    - The ID of the specific item (optional).
   * @property {string} req.body.userId    - The ID of the user (optional).
   * @property {string} req.token.sellerId - The ID of the seller (from the token).
   *
   * @response
   *   - 200 OK:                    { message: "Get average review successfully", data: average review }
   *   - 404 Not Found:             { message: "No reviews found" , data: 0 }
   *   - 500 Internal Server Error: { message: "Failed to get average review", error: error details }
   *
   * @description
   *   - Retrieves the average reviews for all items by a specific seller (by sellerId).
   *   - Retrieves the average review for a specific item by a seller (by sellerId & itemId).
   *   - Retrieves the average reviews for all items reviewed by a specific user (by userId) [Admin Only].
   *   - Retrieves the average review for a specific item reviewed by a specific user (by userId & itemId) [Admin Only].
   */
  async getReviewAverage(req: Request, res: Response): Promise<void> {
    const { itemId, userId } = req.body;
    const sellerId = userId ? userId : req.user?.user_id;
    const reviewAverage = await this.serviceInstance.getReviewAverage(
      sellerId,
      itemId
    );

    if (!reviewAverage) {
      res.status(404).json({ message: "No reviews found", data: 0 });
      return;
    }

    res.status(200).json({
      message: "Get average review Successfully",
      data: reviewAverage,
    });
  }
}

export default ReviewController;
