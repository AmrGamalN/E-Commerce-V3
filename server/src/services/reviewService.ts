import Review from "../models/mongodb/review.model";
import {
  ReviewDtoType,
  ReviewDto,
  ReviewDtoAddType,
  ReviewAddDto,
} from "../dto/review.dto";
import Item from "../models/mongodb/item.model";
import User from "../models/mongodb/user.model";

class ReviewService {
  private static Instance: ReviewService;

  constructor() {}
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
    itemId: string
  ): Promise<ReviewDtoAddType> {
    try {
      // Prevent buyer from rating the same item twice
      const existingReview = await Review.findOne({
        itemId: itemId,
        buyerId: buyerId,
      });

      if (existingReview) {
        throw new Error("You have already reviewed this item.");
      }

      const parsed = ReviewAddDto.safeParse(data);
      if (!parsed.success) {
        throw new Error("Invalid review data");
      }

      // Get seller id && create review && update item to add review id in reviewId array
      const item = await Item.findById({ _id: itemId }).select("userId").lean();
      const review = await Review.create({
        ...parsed.data,
        itemId,
        buyerId: buyerId,
        sellerId: item?.userId,
      });

      await Promise.all([
        Item.findByIdAndUpdate(itemId, {
          $push: { reviewId: review._id },
        }),
        review.save(),
      ]);

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
      const retrievedReview = await Review.findOne({
        _id: reviewId,
        sellerId: userId,
      });

      if (retrievedReview == null) {
        throw new Error("Review not found");
      }
      const parsed = ReviewDto.safeParse(retrievedReview);

      if (!parsed.success) {
        throw new Error("Invalid review data");
      }
      const review = { _id: retrievedReview?._id, ...parsed.data };
      return review;
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
        .limit(10);

      const reviewDto = retrievedReview.map((review) => {
        const { _id, ...reviews } = review.toObject();
        const parsed = ReviewDto.safeParse(reviews);
        if (!parsed.success) {
          throw new Error("Invalid review data");
        }
        return { _id, ...parsed.data };
      });
      return reviewDto;
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
  ): Promise<ReviewDtoAddType | null> {
    try {
      const parsed = ReviewAddDto.safeParse(data);
      if (!parsed.success) {
        throw new Error("Invalid review data");
      }
      const updatedReview = await Review.findOneAndUpdate(
        {
          _id: reviewId,
          buyerId: buyerId,
        },
        {
          $set: parsed.data,
        },
        { new: true, runValidators: true }
      );

      return updatedReview ? updatedReview.toObject() : null;
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
  async deleteReview(reviewId: string, buyerId: string): Promise<Number> {
    try {
      const query: any = buyerId
        ? { _id: reviewId, buyerId: buyerId }
        : { _id: reviewId };

      // Delete review from item and review document
      const [deletedReview] = await Promise.all([
        Review.deleteOne(query),
        Item.updateOne(
          { reviewId: reviewId },
          { $pull: { reviewId: reviewId } }
        ),
      ]);

      return deletedReview.deletedCount;
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
    const titles = ["bad", "average", "good", "very good", "excellent"];

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
