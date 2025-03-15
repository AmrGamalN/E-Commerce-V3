import { Request, Response } from "express";
import FirebaseService from "../../services/dashboard/firebase.service";
class FirebaseController {
  private static instance: FirebaseController;
  private serviceInstance: FirebaseService;
  constructor() {
    this.serviceInstance = new FirebaseService();
  }
  public static getInstance(): FirebaseController {
    if (!FirebaseController.instance) {
      FirebaseController.instance = new FirebaseController();
    }
    return FirebaseController.instance;
  }

  // Get all user
  async getAllUsers(req: Request, res: Response): Promise<void> {
    const { verify } = req.body;
    const retrievedUsers = await this.serviceInstance.getAllUsers(verify);
    if (!retrievedUsers.success == false) {
      res
        .status(retrievedUsers.statusCode)
        .json({ message: retrievedUsers.message, data: retrievedUsers.data });
      return;
    }
    res
      .status(retrievedUsers.statusCode)
      .json({ message: retrievedUsers.message, data: retrievedUsers.data });
  }

  // Delete all user not verify email or phone
  async deleteAllUserNotVerify(req: Request, res: Response): Promise<void> {
    const retrievedUsers = await this.serviceInstance.deleteAllUserNotVerify();
    if (!retrievedUsers.success == false) {
      res
        .status(retrievedUsers.statusCode)
        .json({ message: retrievedUsers.message, data: retrievedUsers.data });
      return;
    }
    res
      .status(retrievedUsers.statusCode)
      .json({ message: retrievedUsers.message, data: retrievedUsers.data });
  }

  // Update user
  async updateUser(req: Request, res: Response): Promise<void> {}
}

export default FirebaseController;
