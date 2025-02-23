import { Request, Response } from "express";
import ItemService from "../services/itemService";

class ItemController {
  private static Instance: ItemController;
  private serviceInstance: ItemService;
  constructor() {
    this.serviceInstance = ItemService.getInstance();
  }

  public static getInstance(): ItemController {
    if (!ItemController.Instance) {
      ItemController.Instance = new ItemController();
    }
    return ItemController.Instance;
  }

  private handleError(
    res: Response,
    message: string,
    error: unknown,
    status = 400
  ): void {
    res.status(status).json({
      message,
      error: error instanceof Error ? error.message : error,
    });
  }

  // Add item
  async addItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.user_id;
      const retrievedItem = await this.serviceInstance.addItem(
        req.body,
        userId
      );
      if (!retrievedItem) {
        res.status(400).json({ message: "Failed to add item" });
        return;
      }
      res.status(200).json({ message: "Item added Successfully" });
    } catch (error) {
      this.handleError(res, "Failed to add item", error);
    }
  }

  // Get Item
  async getItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.user_id;
      const retrievedItem = await this.serviceInstance.getItem(
        String(id),
        userId
      );
      if (retrievedItem?.userId == null) {
        res.status(404).json({ message: "Not found Item", data: [] });
        return;
      }
      res
        .status(200)
        .json({ message: "Item get Successfully", data: retrievedItem });
    } catch (error) {
      this.handleError(res, "Failed to get item", error);
    }
  }

  // Get all items
  async getAllItem(req: Request, res: Response): Promise<void> {
    try {
      const { page } = req.query;
      const userId = req.user?.user_id;
      const retrievedItems = await this.serviceInstance.getAllItem(
        userId,
        Number(page)
      );
      const count = await this.serviceInstance.countItems();
      if (retrievedItems.length == 0) {
        res.status(200).json({ message: "Not found Items", data: [] });
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
        message: "Items get Successfully",
        data: retrievedItems,
      });
    } catch (error) {
      this.handleError(res, "Failed to get items", error);
    }
  }

  // Update item
  async updateItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.user_id;
      const retrievedItem = await this.serviceInstance.updateItem(
        String(id),
        userId,
        req.body
      );
      if (retrievedItem == null) {
        res.status(404).json({ message: "Not found Item", data: [] });
        return;
      }
      res
        .status(200)
        .json({ message: "Item updated Successfully", data: retrievedItem });
    } catch (error) {
      this.handleError(res, "Failed to update item", error);
    }
  }

  // Count of Item
  async countItems(req: Request, res: Response): Promise<void> {
    try {
      const count = await this.serviceInstance.countItems();
      if (count == 0) {
        res.status(404).json({ message: "Not found Items", data: 0 });
        return;
      }
      res.status(200).json({
        message: "Count item fetched successfully",
        data: count,
      });
    } catch (error) {
      this.handleError(res, "Failed to fetch count item!", error);
    }
  }

  // Delete item
  async deleteItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.user_id;
      const retrievedItem = await this.serviceInstance.deleteItem(
        String(id),
        userId
      );
      if (retrievedItem == 0) {
        res.status(404).json({ message: "Not found Item", data: [] });
        return;
      }
      res.status(200).json({ message: "Item deleted Successfully", data: [] });
    } catch (error) {
      this.handleError(res, "Failed to delete item", error);
    }
  }

  async filterItem(req: Request, res: Response): Promise<void> {
    try {
      const { page } = req.query;
      const retrievedItems = await this.serviceInstance.filterItem(
        req.query,
        Number(page)
      );
      if (retrievedItems.length == 0) {
        res.status(200).json({ message: "Not found Items", data: [] });
        return;
      }
      res
        .status(200)
        .json({ message: "Items get Successfully", data: retrievedItems });
    } catch (error) {
      this.handleError(res, "Failed to get item", error);
    }
  }
}

export default ItemController;
