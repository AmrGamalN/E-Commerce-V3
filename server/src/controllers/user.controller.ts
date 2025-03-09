import { auth } from "../config/firebaseConfig";
import UserService from "../services/user.service";
import { Request, Response } from "express";
import { sendVerificationEmail } from "../utils/sendEmail";

class UserController {
  private static instance: UserController;
  private serviceInstance: UserService;
  constructor() {
    this.serviceInstance = new UserService();
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
    if (retrievedUser == 0) {
      await auth.deleteUser(id);
      res
        .status(404)
        .json({ message: `Not found '${role ?? "user"}`, data: [] });
      return;
    }
    res.status(200).json({ message: "User deleted Successfully", data: [] });
  }

  // Update password by link
  async resetPasswordUserByLink(req: Request, res: Response): Promise<void> {
    const email = req.user?.email;
    const passwordResetLink = await auth.generatePasswordResetLink(email);
    const sendLink = await sendVerificationEmail(
      email,
      passwordResetLink,
      "Reset password",
      "The link to reset your password:"
    );

    if (sendLink == false) {
      res.status(400).json({
        message: "Error sending email",
      });
    }

    res.status(200).json({
      message: "Password reset link sent successfully",
    });
  }

  // Update password directly
  async userUpdatePassword(req: Request, res: Response): Promise<void> {
    const userId = req.user?.user_id;
    const { password } = req.body;
    await auth.updateUser(userId, { password: password });
    res.status(200).json({ message: "Password updated successfully" });
  }
}

export default UserController;
