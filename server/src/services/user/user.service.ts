import {
  UserDto,
  UserDtoType,
  UserUpdateDto,
  UserUpdateDtoType,
} from "../../dto/user/user.dto";
import { User } from "../../models/mongodb/user/user.model";
import { Security } from "../../models/mongodb/user/userSecurity.model";
import { UserSecurityDtoType } from "../../dto/user/userSecurity.dto";
import {
  formatDataGetAll,
  formatDataGetOne,
  formatDataUpdate,
} from "../../utils/dataFormatter";
import { auth } from "../../config/firebaseConfig";
import DashboardService from "../dashboard/dashboard.service";
import { sendVerificationEmail } from "../../utils/sendEmail";
import bcrypt from "bcrypt";

class UserService {
  private static Instance: UserService;
  private DashboardService: DashboardService;
  constructor() {
    this.DashboardService = new DashboardService();
  }

  public static getInstance() {
    if (!UserService.Instance) {
      UserService.Instance = new UserService();
    }
    return UserService.Instance;
  }

  // Get user
  async getUser(id: string): Promise<UserDtoType> {
    try {
      const userRetrieved = await User.findOne({ userId: id })
        .populate<{ userId: UserSecurityDtoType }>({
          path: "userId",
          model: "securities",
          localField: "userId",
          foreignField: "userId",
        })
        .lean();

      if (!userRetrieved) {
        throw new Error("User security details not found");
      }

      const { userId, ...user } = userRetrieved;
      const userMerge = { ...userId, ...user };
      return formatDataGetOne(userMerge, UserDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching user"
      );
    }
  }

  // Get all user
  async getAllUser(page: number, role: string): Promise<UserDtoType[]> {
    try {
      const query = role && role !== "undefined" ? { role } : {};
      page = Math.max(1, page || 1);
      const usersRetrieved = await User.find(query)
        .lean()
        .skip((page - 1) * 10)
        .limit(10)
        .populate<{ userId: UserSecurityDtoType }>({
          path: "userId",
          model: "securities",
          select:
            "fcmTokens twoFactorSecret isTwoFactorAuth numberLogin lastFailedLoginTime confirmAccount active dateOfJoining",
          localField: "userId",
          foreignField: "userId",
        });

      return formatDataGetAll(
        usersRetrieved.map(({ userId, ...user }) => ({
          ...user,
          ...userId,
        })),
        UserDto
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : `Error fetching '${role ?? "users"}`
      );
    }
  }

  // Remove user
  async deleteUser(userId: string, role?: string): Promise<object> {
    try {
      const [deleteSecurity, deletedUser] = await Promise.all([
        Security.findOneAndDelete({ userId, role: role })
          .select(["active"])
          .lean(),
        User.findOneAndDelete({ userId })
          .select(["gender business personal"])
          .lean(),
      ]);
      await auth.deleteUser(userId);

      if (!deletedUser) {
        return { message: `Not found '${role ?? "user"}`, data: [] };
      }

      //Update Dashboard
      const userStats = Object.fromEntries(
        Object.entries({
          totalDeletedAccounts: 1,
          totalUsers: -1,
          activeUsers: deleteSecurity?.active && -1,
          inactiveUsers: deleteSecurity?.active === false && -1,
          totalMen: deletedUser.gender === "male" && -1,
          totalWomen: deletedUser.gender === "female" && -1,
          totalBusinessAccounts: deletedUser.business && -1,
          totalPersonalAccounts: deletedUser.business === false && -1,
        }).filter(([_, value]) => value)
      );
      this.DashboardService.updateDashboardRecordsInCaching(userStats);
      return { message: "User deleted Successfully", data: [] };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : `Error deleting '${role ?? "user"}'`
      );
    }
  }

  // Update user
  async updateUser(userId: string, data: UserUpdateDtoType): Promise<number> {
    try {
      const parsed = formatDataUpdate(data, UserUpdateDto);
      const updatedUser = await User.updateOne(
        {
          userId: userId,
        },
        {
          $set: parsed,
        }
      );
      return updatedUser.modifiedCount;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error updating items"
      );
    }
  }

  // Count of user
  async countUser(role?: string | null): Promise<number> {
    try {
      const query = role && role !== "undefined" ? { role } : {};
      const count = await User.countDocuments(query);
      return count;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : `Error fetching '${role ?? "users"} count`
      );
    }
  }

  // here error not update password in database when phone
  async resetPasswordUserByLink(email: string): Promise<Object> {
    try {
      const passwordResetLink = await auth.generatePasswordResetLink(email);
      const sendLink = await sendVerificationEmail(
        email,
        passwordResetLink,
        "Reset password",
        "The link to reset your password:"
      );

      if (sendLink == false && passwordResetLink) {
        return {
          message: "Something error Please try aging",
          success: false,
        };
      }

      return {
        message: "Password reset link sent successfully",
        success: true,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : `Error updated password`
      );
    }
  }

  async updatePassword(userId: string, password: string): Promise<Object> {
    try {
      const updatedPassword = await Security.findOneAndUpdate(
        { userId: userId },
        {
          $set: { password: await bcrypt.hash(password, 10) },
        }
      );

      if (updatedPassword?.password == password) {
        return {
          message: "The new password cannot be the same as the old one.",
          success: false,
        };
      }

      await auth.updateUser(userId, { password: password });
      return {
        message: "Password updated successfully",
        success: true,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : `Error updated password`
      );
    }
  }
}

export default UserService;
