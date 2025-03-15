import { Request, Response } from "express";
import ItemService from "../../services/ecommerce/item.service";

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

  // Add item
  async addItem(req: Request, res: Response): Promise<void> {
    const userId = req.user?.user_id;
    const retrievedItem = await this.serviceInstance.addItem(req.body, userId);
    if (!retrievedItem) {
      res.status(400).json({ message: "Failed to add item" });
      return;
    }
    res.status(200).json({ message: "Item added Successfully" });
  }

  // Get Item
  async getItem(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
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
  }

  // Get all items
  async getAllItem(req: Request, res: Response): Promise<void> {
    const { page } = req.query;
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
    const retrievedItems = await this.serviceInstance.getAllItem(
      userId,
      Number(page)
    );

    const count = await this.serviceInstance.countItems(userId);

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
  }

  // Update item
  async updateItem(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user?.user_id;
    const retrievedItem = await this.serviceInstance.updateItem(
      String(id),
      userId,
      req.body
    );
    if (retrievedItem == 0) {
      res.status(404).json({ message: "Not found item" });
      return;
    }
    res.status(200).json({ message: "Item updated successfully" });
  }

  // Count of Item
  async countItems(req: Request, res: Response): Promise<void> {
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
    const count = await this.serviceInstance.countItems(userId);
    if (count == 0) {
      res.status(404).json({ message: "Not found Items", data: 0 });
      return;
    }
    res.status(200).json({
      message: "Count item fetched successfully",
      data: count,
    });
  }

  // Delete item
  async deleteItem(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
    const deleteItem = await this.serviceInstance.deleteItem(
      String(id),
      userId
    );
    if (!deleteItem) {
      res.status(404).json();
      return;
    }
    res.status(200).json(deleteItem);
  }

  async filterItem(req: Request, res: Response): Promise<void> {
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
  }

  // Update item status
  async updateItemStatus(req: Request, res: Response): Promise<void> {
    const { itemId, status } = req.body;
    const retrievedItem = await this.serviceInstance.updateItemStatus(
      itemId,
      status
    );
    if (retrievedItem == null) {
      res.status(404).json(retrievedItem);
      return;
    }
    res.status(200).json(retrievedItem);
  }
}

export default ItemController;
