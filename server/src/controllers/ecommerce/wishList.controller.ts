import { NextFunction, Request, Response } from "express";
import WishListService from "../../services/ecommerce/wishList.service";

class WishListController {
  private static Instance: WishListController;
  private serviceInstance: WishListService;
  constructor() {
    this.serviceInstance = WishListService.getInstance();
  }

  public static getInstance(): WishListController {
    if (!WishListController.Instance) {
      WishListController.Instance = new WishListController();
    }
    return WishListController.Instance;
  }

  // Add wishList
  async addWishList(req: Request, res: Response): Promise<void> {
    const userId = req.user?.user_id;
    const retrievedWishList = await this.serviceInstance.addWishList(
      req.body,
      userId
    );
    if (!retrievedWishList) {
      res.status(400).json({ message: "Failed to add wishList" });
      return;
    }
    res.status(200).json({ message: "WishList added Successfully" });
  }

  // Get WishList
  async getWishList(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user?.user_id;
    const retrievedWishList = await this.serviceInstance.getWishList(
      String(id),
      userId
    );
    if (retrievedWishList == null) {
      res.status(404).json({ message: "Not found WishList", data: [] });
      return;
    }
    res
      .status(200)
      .json({ message: "WishList get Successfully", data: retrievedWishList });
  }

  // Count of WishList
  async countWishList(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user?.user_id;
    const count = await this.serviceInstance.countWishList(id, userId);
    if (count == 0) {
      res.status(404).json({ message: "Not found WishList", data: 0 });
      return;
    }
    res.status(200).json({
      message: "Count wishList fetched successfully",
      data: count,
    });
  }

  // Delete wishList
  async deleteWishList(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { itemId } = req.body;
    const userId = req.user?.user_id;
    const retrievedWishList = await this.serviceInstance.deleteWishList(
      id,
      itemId,
      userId
    );
    if (retrievedWishList == 0) {
      res.status(404).json({ message: "Not found wishList" });
      return;
    }
    res.status(200).json({ message: "WishList deleted successfully" });
  }

  // Clear all items
  async clearWishList(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user?.user_id;
    const retrievedWishList = await this.serviceInstance.clearWishList(
      id,
      userId
    );
    if (retrievedWishList == 0) {
      res.status(404).json({ message: "Not found wishList" });
      return;
    }
    res.status(200).json({ message: "WishList clear successfully" });
  }
}
export default WishListController;
