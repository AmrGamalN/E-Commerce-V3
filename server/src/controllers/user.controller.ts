import { auth } from "../config/firebaseConfig";
import UserService from "../services/userService";
import { Request, Response } from "express";
import { sendVerificationEmail } from "../utils/emailUtil";

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

  private handleError(
    res: Response,
    message: string,
    error: unknown,
    status = 500
  ): void {
    res.status(status).json({
      message,
      error: error instanceof Error ? error.message : error,
    });
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.user_id;
      const retrievedUser = await this.serviceInstance.getUser(userId);
      if (retrievedUser == null) {
        res.status(404).json({ message: "Not found user", data: [] });
        return;
      }
      res
        .status(200)
        .json({ message: "User get Successfully", data: retrievedUser });
    } catch (error) {
      this.handleError(res, "Failed to get user", error);
    }
  }

  async getAllUser(req: Request, res: Response): Promise<void> {
    const { role } = req.body;
    try {
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
    } catch (error) {
      this.handleError(res, `Failed to get '${role ?? "users"}'`, error);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.user_id;
      const retrievedUser = await this.serviceInstance.updateUser(
        userId,
        req.body
      );
      if (retrievedUser == null) {
        res.status(404).json({ message: "Not found user", data: [] });
        return;
      }
      res.status(200).json({
        message: "User updated Successfully",
        data: retrievedUser,
      });
    } catch (error) {
      this.handleError(res, "Failed to update user!", error);
    }
  }

  async countUser(req: Request, res: Response): Promise<void> {
    const { role } = req.body;
    try {
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
    } catch (error) {
      this.handleError(
        res,
        `Failed to fetch count '${role ?? "user"}'!`,
        error
      );
    }
  }

  // Delete user from firebase and database
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
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
    } catch (error) {
      this.handleError(res, "Failed to delete user!", error);
    }
  }

  // Update password by link
  async resetPasswordUserByLink(req: Request, res: Response): Promise<void> {
    try {
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
    } catch (error) {
      this.handleError(res, "Error resetting password!", error);
    }
  }

  // Update password directly
  async userUpdatePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.user_id;
      const { password } = req.body;
      await auth.updateUser(userId, { password: password });
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      this.handleError(res, "Error updating password!", error);
    }
  }
}

export default UserController;
