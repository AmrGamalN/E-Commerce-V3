import { UserDto, UserDtoType } from "../dto/user.dto";
import User from "../models/mongodb/user.model";
import { auth } from "../config/firebaseConfig";

class AuthService {
  private static instance: AuthService;
  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Register user
  async registerUser(
    email: string,
    password: string,
    role: string,
    body: UserDtoType
  ): Promise<void> {
    try {
      const userRegister = await auth.createUser({ email, password });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to create user"
      );
    }
  }
}

export default AuthService;
