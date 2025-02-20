import { UserDto, UserDtoType } from "../dto/user.dto";
import User from "../models/mongodb/user.model";
import { auth } from "../config/firebaseConfig";
import { client } from "../config/redisConfig";
import admin from "firebase-admin";

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
      const user = new User({
        ...body,
        email: email,
        userId: userRegister.uid,
        role: role || "USER",
        dateOfJoining: new Date(),
      });

      const parsed = UserDto.safeParse(user);
      if (!parsed.success) {
        throw new Error("Invalid user data");
      }
      // Store user details in caching and send verification to use email
      await auth.generateEmailVerificationLink(email);
      await client.setEx(
        `userId:${userRegister.uid}`,
        3600, // After 1 hours delete user auto from caching
        JSON.stringify(user)
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Registration failed"
      );
    }
  }

  async verifyEmail(uid: string): Promise<void> {
    try {
      const userDataString = (await client.get(`userId:${uid}`)) ?? "";
      if (!userDataString) {
        throw new Error("User not found in cache");
      }
      const userData = JSON.parse(userDataString);

      const parsed = UserDto.safeParse(userData);
      if (!parsed.success) {
        throw new Error("Invalid user data");
      }

      // Create and save user in mongodb & Delete from caching
      const user = new User(userData);
      await user.save();
      await client.del(`userId:${uid}`);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Email verification failed"
      );
    }
  }
}

export default AuthService;
