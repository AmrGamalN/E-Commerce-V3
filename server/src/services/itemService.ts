import Item from "../models/mongodb/item.model";
import {
  ItemDtoType,
  ItemDto,
  ItemAddDto,
  ItemAddDtoType,
} from "../dto/item.dto";

class ItemService {
  private static Instance: ItemService;
  constructor() {}
  public static getInstance(): ItemService {
    if (!ItemService.Instance) {
      ItemService.Instance = new ItemService();
    }
    return ItemService.Instance;
  }

  // Add item
  async addItem(data: ItemAddDtoType, userId: string): Promise<ItemDtoType> {
    try {
      const parsed = ItemAddDto.safeParse(data);
      if (!parsed.success) {
        throw new Error("Invalid item data");
      }
      const item = await Item.create({ ...parsed.data, userId });
      await item.save();
      return item;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error adding items"
      );
    }
  }

  // Get Item by itemId and userId
  async getItem(itemId: string, userId: string): Promise<ItemDtoType> {
    try {
      const retrievedItem = await Item.findOne({
        _id: itemId,
        userId: userId,
      });

      if (retrievedItem?.userId == null) {
        throw new Error("Item not found");
      }

      const { _id, ...itemData } = retrievedItem.toObject();
      const parsed = ItemDto.safeParse(retrievedItem);
      if (!parsed.success) {
        throw new Error("Invalid item data");
      }
      return { _id, ...parsed.data };
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
        .limit(10);

      const itemDto = retrievedItem.map((item) => {
        const { _id, ...items } = item.toObject();
        const parsed = ItemDto.safeParse(items);
        if (!parsed.success) {
          throw new Error("Invalid item data");
        }
        return { _id, ...parsed.data };
      });
      return itemDto;
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
  ): Promise<ItemAddDtoType | null> {
    try {
      const parsed = ItemAddDto.safeParse(data);
      if (!parsed.success) {
        throw new Error("Invalid item data");
      }

      const updatedItem = await Item.findOneAndUpdate(
        {
          _id: itemId,
          userId: userId,
        },
        {
          $set: parsed.data,
        },
        { new: true, runValidators: true }
      );

      return updatedItem ? updatedItem.toObject() : null;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error updating items"
      );
    }
  }

  // Count of Item
  async countItems(): Promise<number> {
    try {
      const count = await Item.countDocuments();
      return count;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching item count"
      );
    }
  }

  // Delete item
  async deleteItem(itemId: string, userId: string): Promise<Number> {
    try {
      const deletedItem = await Item.deleteOne({ _id: itemId, userId: userId });
      return deletedItem.deletedCount;
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
    if (filters.communications) {
      query["communications"] = filters.communications;
    }

    if (filters.min && filters.max) {
      query["price"] = { $gte: Number(filters.min), $lte: Number(filters.max) };
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
}

export default ItemService;
