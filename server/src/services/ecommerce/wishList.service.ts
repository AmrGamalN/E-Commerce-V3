import WishList from "../../models/mongodb/ecommerce/wishList.model";
import {
  WishListDtoType,
  WishListDto,
  WishListAddDtoType,
  WishListAddDto,
} from "../../dto/ecommerce/wishList.dto";
import {
  formatDataAdd,
  formatDataGetAll,
  formatDataGetOne,
} from "../../utils/dataFormatter";
import mongoose from "mongoose";

class WishListService {
  private static Instance: WishListService;
  constructor() {}
  public static getInstance(): WishListService {
    if (!WishListService.Instance) {
      WishListService.Instance = new WishListService();
    }
    return WishListService.Instance;
  }

  // Add wishList
  async addWishList(
    data: WishListAddDtoType,
    userId: string
  ): Promise<WishListDtoType> {
    try {
      // Validate and parse the incoming data
      const parsed = formatDataAdd(data, WishListAddDto);
      // Check if the wishlist already contains the given item
      const wishList = await WishList.findOne({
        userId: userId,
      }).lean();

      // If the wishlist exists, check if the item is already added
      if (wishList) {
        if (
          wishList.items.some(
            (item) => item.itemId.toString() === parsed.itemId
          )
        ) {
          throw new Error("Item already in wishlist");
        }

        // Update the wishlist by adding the new item
        const updatedWishList = await WishList.findOneAndUpdate(
          { userId },
          { $push: { items: { itemId: parsed.itemId } } },
          { new: true, runValidators: true }
        ).lean();

        if (!updatedWishList) {
          throw new Error("Failed to add wishList");
        }
        return updatedWishList;
      }

      // If the wishlist doesn't exist, create a new one
      return await WishList.create({
        userId,
        items: [{ itemId: parsed.itemId }],
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error adding wishList"
      );
    }
  }

  // Get WishList by wishListId and userId
  async getWishList(
    wishListId: string,
    userId: string
  ): Promise<WishListDtoType> {
    try {
      const retrievedWishList = await WishList.findById({
        _id: new mongoose.Types.ObjectId(wishListId),
        userId,
      }).lean();
      return formatDataGetOne(retrievedWishList, WishListDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching wishList"
      );
    }
  }

  // Count of WishList
  async countWishList(wishListId: string, userId: string): Promise<number> {
    try {
      const count = await WishList.findById({
        _id: new mongoose.Types.ObjectId(wishListId),
        userId,
      });
      return count?.items.length ?? 0;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching wishList count"
      );
    }
  }

  // Delete wishList
  async deleteWishList(
    wishListId: string,
    itemId: string,
    userId: string
  ): Promise<Number> {
    try {
      const deletedWishList = await WishList.updateOne(
        {
          _id: wishListId,
          userId,
          "items.itemId": itemId,
        },
        {
          $pull: { items: { itemId: itemId } },
        }
      ).lean();
      return deletedWishList.matchedCount;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error deleting wishList"
      );
    }
  }

  // Clear all items
  async clearWishList(wishListId: string, userId: string): Promise<Number> {
    try {
      const deletedWishList = await WishList.deleteOne({
        _id: new mongoose.Types.ObjectId(wishListId),
        userId,
      });
      return deletedWishList.deletedCount;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error clear wishList"
      );
    }
  }
}

export default WishListService;
