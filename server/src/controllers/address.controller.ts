import { Request, Response } from "express";
import AddressService from "../services/addressService";

class AddressController {
  private static Instance: AddressController;
  private serviceInstance: AddressService;
  constructor() {
    this.serviceInstance = AddressService.getInstance();
  }

  public static getInstance(): AddressController {
    if (!AddressController.Instance) {
      AddressController.Instance = new AddressController();
    }
    return AddressController.Instance;
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

  // Add address
  async addAddress(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.user_id;
      const retrievedAddress = await this.serviceInstance.addAddress(
        req.body,
        userId
      );
      if (!retrievedAddress) {
        res.status(400).json({ message: "Failed to add address" });
        return;
      }
      res.status(200).json({ message: "Address added Successfully" });
    } catch (error) {
      this.handleError(res, "Failed to add address", error);
    }
  }

  // Get Address
  async getAddress(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.user_id;
      const retrievedAddress = await this.serviceInstance.getAddress(
        String(id),
        userId
      );
      if (retrievedAddress == null) {
        res.status(404).json({ message: "Not found Address", data: [] });
        return;
      }
      res
        .status(200)
        .json({ message: "Address get Successfully", data: retrievedAddress });
    } catch (error) {
      this.handleError(res, "Failed to get address", error);
    }
  }

  // Get all address
  async getAllAddress(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.user_id;
      const retrievedAddress = await this.serviceInstance.getAllAddress(userId);
      const count = await this.serviceInstance.countAddress();
      if (retrievedAddress.length == 0) {
        res.status(200).json({ message: "Not found Address", data: [] });
        return;
      }
      res.status(200).json({
        count: count,
        message: "Address get Successfully",
        data: retrievedAddress,
      });
    } catch (error) {
      this.handleError(res, "Failed to get address", error);
    }
  }

  // Update address
  async updateAddress(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.user_id;
      const retrievedAddress = await this.serviceInstance.updateAddress(
        String(id),
        userId,
        req.body
      );
      if (retrievedAddress == null) {
        res.status(404).json({ message: "Not found Address", data: [] });
        return;
      }
      res.status(200).json({
        message: "Address updated Successfully",
        data: retrievedAddress,
      });
    } catch (error) {
      this.handleError(res, "Failed to update address", error);
    }
  }

  // Count of Address
  async countAddress(req: Request, res: Response): Promise<void> {
    try {
      const count = await this.serviceInstance.countAddress();
      if (count == 0) {
        res.status(404).json({ message: "Not found Address", data: 0 });
        return;
      }
      res.status(200).json({
        message: "Count address fetched successfully",
        data: count,
      });
    } catch (error) {
      this.handleError(res, "Failed to fetch count address!", error);
    }
  }

  // Delete address
  async deleteAddress(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.user_id;
      const retrievedAddress = await this.serviceInstance.deleteAddress(
        String(id),
        userId
      );
      if (retrievedAddress == 0) {
        res.status(404).json({ message: "Not found Address", data: [] });
        return;
      }
      res
        .status(200)
        .json({ message: "Address deleted Successfully", data: [] });
    } catch (error) {
      this.handleError(res, "Failed to delete address", error);
    }
  }
}

export default AddressController;
