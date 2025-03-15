import { auth } from "../../config/firebaseConfig";
import UserService from "../../services/user/user.service";
import { Request, Response } from "express";
import { sendVerificationEmail } from "../../utils/sendEmail";
import DashboardService from "../../services/dashboard/dashboard.service";

class UserController {
  private static instance: UserController;
  private serviceInstance: UserService;
  private DashboardService: DashboardService;
  constructor() {
    this.serviceInstance = new UserService();
    this.DashboardService = new DashboardService();
  }

  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
    const retrievedUser = await this.serviceInstance.getUser(userId);
    if (retrievedUser == null) {
      res.status(200).json({ message: "Not found user", data: [] });
      return;
    }
    res
      .status(200)
      .json({ message: "User get Successfully", data: retrievedUser });
  }

  // Used to get all admin or users or all users and admin in database
  async getAllUser(req: Request, res: Response): Promise<void> {
    const { role } = req.body;
    const { page } = req.query;
    const retrievedUsers = await this.serviceInstance.getAllUser(
      Number(page),
      String(role)
    );

    const count = await this.serviceInstance.countUser();
    if (retrievedUsers.length == 0) {
      res
        .status(200)
        .json({ message: `Not found '${role ?? "users"}'`, data: [] });
      return;
    }

    const totalPages = Math.ceil(count / 10);
    const remainPages = totalPages - Number(page);
    res.status(200).json({
      paginationInfo: {
        currentPage: Number(page),
        totalPages: totalPages,
        totalUsers: count,
        remainPages: remainPages > 0 ? remainPages : 0,
        itemsPerPage: 10,
      },
      message: `'${role ?? "users"}' get Successfully`,
      data: retrievedUsers,
    });
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const userId = req.user?.user_id;
    const retrievedUser = await this.serviceInstance.updateUser(
      userId,
      req.body
    );
    if (retrievedUser == 0) {
      res.status(404).json({ message: "Not found user" });
      return;
    }
    res.status(200).json({
      message: "User updated successfully",
    });
  }

  // Used to count all admin or users or all users and admin in database
  async countUser(req: Request, res: Response): Promise<void> {
    const { role } = req.body;
    const count = await this.serviceInstance.countUser(String(role));
    if (count == 0) {
      res
        .status(404)
        .json({ message: `Not found '${role ?? "user"}'`, data: 0 });
      return;
    }
    res.status(200).json({
      message: `Count '${role ?? "user"}' fetched successfully`,
      data: count,
    });
  }

  // Delete user from firebase and database
  async deleteUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { role } = req.body;
    const retrievedUser = await this.serviceInstance.deleteUser(
      String(id),
      String(role)
    );
    if (!retrievedUser) {
      await auth.deleteUser(id);
      res.status(404).json(retrievedUser);
      return;
    }
    res.status(200).json(retrievedUser);
  }

  // Update password by link
  async resetPasswordUserByLink(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const resetPassword = (await this.serviceInstance.resetPasswordUserByLink(
      email
    )) as { success: boolean };

    if (resetPassword.success == false) {
      res.status(400).json(resetPassword);
    }

    // Update dashboard
    this.DashboardService.updateDashboardRecordsInCaching({
      totalResetPassword: 1,
    });
    res.status(200).json(resetPassword);
  }

  // Update password directly
  async UpdatePassword(req: Request, res: Response): Promise<void> {
    const userId = req.user?.user_id;
    const { password } = req.body;
    const updatePassword = (await this.serviceInstance.updatePassword(
      userId,
      password
    )) as { message: string; success: boolean };

    if (updatePassword.success == false) {
      res.status(400).json(updatePassword);
      return;
    }

    // Update dashboard
    this.DashboardService.updateDashboardRecordsInCaching({
      totalUpdatePassword: 1,
    });
    res.status(200).json(updatePassword);
  }
}

export default UserController;
