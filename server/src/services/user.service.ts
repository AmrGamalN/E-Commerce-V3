import {
  UserDto,
  UserDtoType,
  UserUpdateDto,
  UserUpdateDtoType,
} from "../dto/user.dto";
import User from "../models/mongodb/user.model";
import { formatDataGetAll, formatDataGetOne, formatDataUpdate } from "../utils/dataFormatter";
class UserService {
  private static Instance: UserService;
  constructor() {}

  public static getInstance() {
    if (!UserService.Instance) {
      UserService.Instance = new UserService();
    }
    return UserService.Instance;
  }

  // Get user
  async getUser(userId: string): Promise<UserDtoType> {
    try {
      const userRetrieved = await User.findOne({ userId }).lean();
      return formatDataGetOne(userRetrieved, UserDto);
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
      page = isNaN(page) || page < 1 ? 1 : page;
      const userRetrieved = await User.find(query)
        .lean()
        .skip((page - 1) * 10)
        .limit(10);
      return formatDataGetAll(userRetrieved, UserDto);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : `Error fetching '${role ?? "users"}`
      );
    }
  }

  // Remove user
  async deleteUser(userId: string, role?: string): Promise<number> {
    try {
      const deletedUser = await User.deleteOne({ userId: userId, role: role });
      return deletedUser.deletedCount;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : `Error fetching '${role ?? "user"}`
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
}

export default UserService;
