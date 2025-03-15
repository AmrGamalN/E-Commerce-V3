import { Request, Response } from "express";
import AddressService from "../../services/user/address.service";

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

  // Add address
  async addAddress(req: Request, res: Response): Promise<void> {
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
  }

  // Get Address
  async getAddress(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
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
  }

  // Get all address
  async getAllAddress(req: Request, res: Response): Promise<void> {
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
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
  }

  // Update address
  async updateAddress(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user?.user_id;
    const retrievedAddress = await this.serviceInstance.updateAddress(
      String(id),
      userId,
      req.body
    );
    if (retrievedAddress == null) {
      res.status(404).json(retrievedAddress);
      return;
    }
    res.status(200).json(retrievedAddress);
  }

  // Count of Address
  async countAddress(req: Request, res: Response): Promise<void> {
    const count = await this.serviceInstance.countAddress();
    if (count == 0) {
      res.status(404).json({ message: "Not found Address", data: 0 });
      return;
    }
    res.status(200).json({
      message: "Count address fetched successfully",
      data: count,
    });
  }

  // Delete address
  async deleteAddress(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user?.user_id;
    const retrievedAddress = await this.serviceInstance.deleteAddress(
      String(id),
      userId
    );
    if (retrievedAddress == 0) {
      res.status(404).json({ message: "Not found address" });
      return;
    }
    res.status(200).json({ message: "Address deleted successfully" });
  }
}
export default AddressController;
