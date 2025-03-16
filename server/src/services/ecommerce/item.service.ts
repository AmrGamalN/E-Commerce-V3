import Item from "../../models/mongodb/ecommerce/item.model";
import {
  ItemDtoType,
  ItemDto,
  ItemAddDto,
  ItemAddDtoType,
} from "../../dto/ecommerce/item.dto";
import {
  formatDataAdd,
  formatDataGetAll,
  formatDataGetOne,
  formatDataUpdate,
} from "../../utils/dataFormatter";
import mongoose from "mongoose";
import DashboardService from "../dashboard/dashboard.service";

class ItemService {
  private static Instance: ItemService;
  private DashboardService: DashboardService;
  constructor() {
    this.DashboardService = new DashboardService();
  }
  public static getInstance(): ItemService {
    if (!ItemService.Instance) {
      ItemService.Instance = new ItemService();
    }
    return ItemService.Instance;
  }

  // Add item
  async addItem(data: ItemAddDtoType, userId: string): Promise<ItemDtoType> {
    try {
      const parsed = formatDataAdd(data, ItemAddDto);
      const isDiscount = Number(data.discount) > 0 ? true : false;
      this.DashboardService.updateDashboardRecordsInCaching({
        underReview: 1,
        newItemsToday: 1,
        totalItems: 1,
      });
      return await Item.create({
        ...parsed,
        userId,
        isDiscount: isDiscount,
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error adding items"
      );
    }
  }

  // Get Item by itemId and userId
  async getItem(itemId: string, userId: string): Promise<ItemDtoType> {
    try {
      const retrievedItem = await Item.findById({
        _id: new mongoose.Types.ObjectId(itemId),
        userId: userId,
      }).lean();
      return formatDataGetOne(retrievedItem, ItemDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching item"
      );
    }
  }

  // Get all items by userId
  async getAllItem(userId: string, page: number = 1): Promise<ItemDtoType[]> {
    try {
      page = isNaN(page) || page < 1 ? 1 : page;
      const retrievedItem = await Item.find({
        userId: userId,
      })
        .skip(10 * (page - 1))
        .limit(10)
        .lean();
      return formatDataGetAll(retrievedItem, ItemDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching items"
      );
    }
  }

  // Update item
  async updateItem(
    itemId: string,
    userId: string,
    data: ItemAddDtoType
  ): Promise<number> {
    try {
      const parsed = formatDataUpdate(data, ItemAddDto);
      const isDiscount = Number(data.discount) > 0 ? true : false;
      const updatedItem = await Item.updateOne(
        {
          _id: itemId,
          userId: userId,
        },
        {
          $set: parsed,
          isDiscount: isDiscount,
        }
      );
      return updatedItem.matchedCount;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error updating items"
      );
    }
  }

  // Count of Item
  async countItems(userId: string): Promise<number> {
    try {
      const count = await Item.countDocuments({ userId });
      return count;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching item count"
      );
    }
  }

  // Delete item
  async deleteItem(itemId: string, userId: string): Promise<object> {
    try {
      const deletedItem = await Item.findOneAndDelete(
        {
          _id: itemId,
          userId: userId,
        },
        {
          select: "status",
        }
      ).lean();

      if (!deletedItem) {
        return { message: "Not found Item", data: [] };
      }

      // Update dashboard
      if ("status" in deletedItem) {
        this.DashboardService.updateDashboardRecordsInCaching({
          totalItems: -1,
          totalDeleteItems: 1,
          [String(deletedItem.status)]: -1,
        });
      }
      return { message: "Item deleted Successfully", data: [] };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error deleting items"
      );
    }
  }

  // Pagination items
  private async fetchItemsWithFilters(
    filter: Record<string, unknown>,
    page: number = 1
  ): Promise<ItemDtoType[]> {
    try {
      page = isNaN(page) || page < 1 ? 1 : page;
      const retrievedItems = await Item.find(filter)
        .skip(10 * (page - 1))
        .limit(10);

      return retrievedItems.map((item) => {
        const { _id, ...items } = item.toObject();
        const parsed = ItemDto.safeParse(items);
        if (!parsed.success) {
          throw new Error("Invalid item data.");
        }
        return { _id, ...parsed.data };
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching items."
      );
    }
  }

  // Filter item
  async filterItem(
    filters: Record<string, any>,
    page: number = 1
  ): Promise<ItemDtoType[]> {
    const query: Record<string, any> = {};
    const ratingIndexMap: Record<string, number> = {
      bad: 0,
      average: 1,
      good: 2,
      very_good: 3,
      excellent: 4,
    };

    if (filters.avgRating) {
      query["rate.avgRating"] = { $gte: filters.avgRating };
    }

    if (filters.title && ratingIndexMap[filters.title] !== undefined) {
      const index = ratingIndexMap[filters.title];
      query[`rate.rating.${index}`] = { $gte: 1 };
    }

    if (filters.communications) {
      query["communications"] = filters.communications;
    }

    if (filters.min && filters.max) {
      query["price"] = { $gte: filters.min, $lte: filters.max };
    }

    if (filters.from && filters.to) {
      query["createdAt"] = {
        $gte: new Date(filters.from),
        $lte: new Date(filters.to),
      };
    }
    if (filters.discount)
      query["isDiscount"] = filters.discount == "true" ? true : false;

    if (filters.allowNegotiate)
      query["allowNegotiate"] = filters.allowNegotiate == "true" ? true : false;

    const stringFilters: (keyof typeof filters)[] = [
      "category",
      "subcategory",
      "brand",
      "type",
      "condition",
      "location",
      "color",
      "size",
    ];

    for (const key of stringFilters) {
      if (filters[key]) {
        query[key] = filters[key];
      }
    }
    return await this.fetchItemsWithFilters(query, page);
  }

  // Update item status
  async updateItemStatus(ItemId: string, status: string): Promise<object> {
    try {
      const updatedItem = await Item.findByIdAndUpdate(
        {
          _id: ItemId,
        },
        {
          $set: { status },
        },
        { select: "status" }
      ).lean();

      if (!updatedItem) {
        return { message: "Item not found" };
      }

      // Update dashboard
      if ("status" in updatedItem) {
        this.DashboardService.updateDashboardRecordsInCaching({
          [status]: 1,
          [String(updatedItem.status)]: -1,
        });
      }

      return { message: "Item status updated successfully" };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error updating item status"
      );
    }
  }
}

export default ItemService;
