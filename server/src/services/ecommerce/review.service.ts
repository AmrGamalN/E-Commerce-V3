import Review from "../../models/mongodb/ecommerce/review.model";
import {
  ReviewDtoType,
  ReviewDto,
  ReviewDtoAddType,
  ReviewAddDto,
} from "../../dto/ecommerce/review.dto";
import Item from "../../models/mongodb/ecommerce/item.model";
import { User } from "../../models/mongodb/user/user.model";
import {
  formatDataAdd,
  formatDataGetAll,
  formatDataGetOne,
  formatDataUpdate,
} from "../../utils/dataFormatter";
import mongoose from "mongoose";
import DashboardService from "../dashboard/dashboard.service";

class ReviewService {
  private static Instance: ReviewService;
  private DashboardService: DashboardService;
  constructor() {
    this.DashboardService = new DashboardService();
  }
  public static getInstance(): ReviewService {
    if (!ReviewService.Instance) {
      ReviewService.Instance = new ReviewService();
    }
    return ReviewService.Instance;
  }

  // Add review
  async addReview(
    data: ReviewDtoAddType,
    buyerId: string,
    buyerName: string,
    itemId: string
  ): Promise<ReviewDtoAddType> {
    try {
      const parsed = formatDataAdd(data, ReviewAddDto);

      // Prevent buyer from rating the same item twice
      const existingReview = await Review.findOne({
        itemId: itemId,
        buyerId: buyerId,
      });

      if (existingReview) {
        throw new Error("You have already reviewed this item.");
      }

      // Get seller id && create review && update item to add review id in reviewId array
      // const item = await Item.findById({ _id: itemId }).select("userId").lean();
      const review = new Review({
        ...parsed,
        itemId,
        buyerId: buyerId,
        buyerName: buyerName,
        sellerId: undefined,
      });

      const item = await Item.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(itemId) },
        { $push: { reviewId: review._id } },
        { new: true }
      )
        .select("userId")
        .lean();

      if (item?.userId == buyerId) {
        throw new Error("You cannot add a review to your item");
      }

      if (item?.userId) {
        review.sellerId = item.userId;
        await review.save();
      }

      // Update dashboard
      const updateField = {
        newReviewsToday: 1,
        totalReviews: 1,
        [`total${
          String(parsed.title).charAt(0).toUpperCase() +
          String(parsed.title).slice(1)
        }`]: 1,
      };
      this.DashboardService.updateDashboardRecordsInCaching(updateField);
      await review.save();
      return review;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error adding review"
      );
    }
  }

  // Get Review
  async getReview(reviewId: string, userId: string): Promise<ReviewDtoType> {
    try {
      const retrievedReview = await Review.findById({
        _id: new mongoose.Types.ObjectId(reviewId),
        sellerId: userId,
      }).lean();
      return formatDataGetOne(retrievedReview, ReviewDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching review"
      );
    }
  }

  // Get all reviews
  async getAllReview(
    sellerId: string,
    page: number = 1
  ): Promise<ReviewDtoType[]> {
    try {
      page = isNaN(page) || page < 1 ? 1 : page;
      const retrievedReview = await Review.find({
        sellerId: sellerId,
      })
        .skip(10 * (page - 1))
        .limit(10)
        .lean();
      return formatDataGetAll(retrievedReview, ReviewDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching review"
      );
    }
  }

  // Update review
  async updateReview(
    reviewId: string,
    buyerId: string,
    data: ReviewDtoAddType
  ): Promise<object> {
    try {
      const parsed = formatDataUpdate(data, ReviewAddDto);
      const updatedReview = await Review.findByIdAndUpdate(
        {
          _id: reviewId,
          buyerId: buyerId,
        },
        {
          $set: parsed,
        }
      ).lean();

      if (!updatedReview) {
        return { message: "Not found review" };
      }

      // Update dashboard
      if (parsed.title != updatedReview.title) {
        const updateField = {
          totalReviews: 1,
          [`total${
            String(parsed.title).charAt(0).toUpperCase() +
            String(parsed.title).slice(1)
          }`]: 1,
          [`total${
            String(updatedReview.title).charAt(0).toUpperCase() +
            String(updatedReview.title).slice(1)
          }`]: -1,
        };
        this.DashboardService.updateDashboardRecordsInCaching(updateField);
      }
      return { message: "Review updated successfully" };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error updating review"
      );
    }
  }

  // Count reviews
  async countReview(sellerId: string, itemId: string): Promise<number> {
    try {
      const query = itemId ? { sellerId, itemId: itemId } : { sellerId };
      const count = await Review.countDocuments(query);
      return count;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching review count"
      );
    }
  }

  // Delete review
  async deleteReview(reviewId: string, buyerId: string): Promise<object> {
    try {
      const query: any = buyerId
        ? { _id: reviewId, buyerId: buyerId }
        : { _id: reviewId };

      // Delete review from item and review document
      const [deletedReview] = await Promise.all([
        Review.findByIdAndDelete(query),
        Item.updateOne(
          { reviewId: reviewId },
          { $pull: { reviewId: reviewId } }
        ),
      ]);

      if (!deletedReview) {
        return { message: "Not found review", data: [] };
      }

      // Update dashboard
      const updateField = {
        totalReviews: -1,
        [`total${
          String(deletedReview.title).charAt(0).toUpperCase() +
          String(deletedReview.title).slice(1)
        }`]: -1,
      };
      this.DashboardService.updateDashboardRecordsInCaching(updateField);

      return { message: "Review deleted Successfully", data: [] };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error deleting review"
      );
    }
  }

  async getReviewAverage(
    sellerId: string,
    itemId: string
  ): Promise<{ avgRating: number; rating: number[]; totalReviews: number }> {
    try {
      const reviewData = await this.calculateAverageReview(sellerId, itemId);

      const updateQuery = itemId
        ? { model: Item, filter: { _id: itemId } }
        : { model: User, filter: { userId: sellerId } };

      await (updateQuery.model as any).updateOne(updateQuery.filter, {
        $set: { rate: reviewData },
      });

      return reviewData;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to compute review averages: ${error.message}`
          : "Unknown error while fetching review averages"
      );
    }
  }

  private async calculateAverageReview(
    sellerId: string,
    itemId: string
  ): Promise<{ avgRating: number; rating: number[]; totalReviews: number }> {
    const rating: number[] = [0, 0, 0, 0, 0];
    const titles = ["bad", "average", "good", "veryGood", "excellent"];

    // Base query to filter reviews by sellerId and itemId if provided
    const query: any = { sellerId };
    if (itemId) query.itemId = itemId;

    // Get count to each title and calculate average rate
    const results = await Review.aggregate([
      { $match: { ...query, title: { $in: titles } } },
      {
        $group: {
          _id: "$title",
          count: { $sum: 1 },
          averageRating: { $avg: "$rate" },
        },
      },
    ]);

    // Get number reviews && add result to rating && calculate average
    let avgRating = 0;
    const totalReviews = results.reduce((sum, r) => sum + r.count, 0);
    results.forEach((result) => {
      const titleIndex = titles.indexOf(result._id);
      rating[titleIndex] = (result.count / totalReviews) * 100;
      avgRating += (result.averageRating || 0) * (result.count / totalReviews);
    });
    return { avgRating, rating, totalReviews };
  }
}

export default ReviewService;
