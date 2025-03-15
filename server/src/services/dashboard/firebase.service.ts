import { auth } from "../../config/firebaseConfig";

interface ResponseService {
  statusCode: number;
  message: string;
  data: any;
  error?: any;
  success: boolean;
}

class FirebaseService {
  private static instance: FirebaseService;
  constructor() {}
  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  // Get all users or get all user verify based on value of verify
  async getAllUsers(verify?: boolean): Promise<ResponseService> {
    try {
      const retrievedUsers = await auth.listUsers();
      if (!retrievedUsers || retrievedUsers.users.length === 0) {
        return {
          statusCode: 404,
          message: "No users found",
          data: [],
          success: false,
        };
      }

      // Get all user not verify email
      const users = verify
        ? retrievedUsers.users.filter(
            (user) =>
              !user.emailVerified &&
              !user.providerData.some(
                (provider) => provider.providerId === "phone"
              )
          )
        : retrievedUsers.users;

      return {
        statusCode: 200,
        message: verify
          ? "Users with unverified emails fetched successfully"
          : "Users fetched successfully",
        data: users,
        success: true,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Internal server error"
      );
    }
  }

  // Delete all user not verify email or phone
  async deleteAllUserNotVerify(): Promise<ResponseService> {
    try {
      const retrievedUsers = await auth.listUsers();
      if (!retrievedUsers || retrievedUsers.users.length === 0) {
        return {
          statusCode: 404,
          message: "No users found",
          data: [],
          success: false,
        };
      }

      // Get all user not verify email
      const users = retrievedUsers.users
        .filter(
          (user) =>
            !user.emailVerified &&
            !user.providerData.some(
              (provider) => provider.providerId === "phone"
            )
        )
        .map((user) => user.uid);

      if (users.length === 0) {
        return {
          statusCode: 404,
          message: "Not found unverified email",
          data: [],
          success: false,
        };
      }
      await auth.deleteUsers(users);
      return {
        statusCode: 200,
        message: "Users with unverified emails deleted successfully",
        data: [],
        success: true,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Internal server error"
      );
    }
  }

}

export default FirebaseService;
