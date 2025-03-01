import { UserDto } from "../dto/user.dto";
import User from "../models/mongodb/user.model";
import { auth } from "../config/firebaseConfig";
import { client } from "../config/redisConfig";
import { sendVerificationEmail } from "../utils/emailUtil";
import { RegisterDtoType } from "../dto/auth.dto";
import { UserDtoType } from "../dto/user.dto";
import moment from "moment-timezone";
import bcrypt from "bcrypt";

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
    body: RegisterDtoType
  ): Promise<void> {
    try {
      const userRegister = await auth.createUser({
        phoneNumber: body.mobile,
        password,
        email,
      });

      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        ...body,
        email: email,
        password: hashPassword,
        userId: userRegister.uid,
        role: role || "USER",
        dateOfJoining: moment().tz("Africa/Cairo").toISOString(),
        lastSeen: moment().tz("Africa/Cairo").toISOString(),
      });

      const { _id, ...userData } = user.toObject();
      const parsed = UserDto.safeParse(userData);
      if (!parsed.success) {
        throw new Error("Invalid user data");
      }

      // Store user details in caching and send verification to use email
      const verificationLink = await auth.generateEmailVerificationLink(email);
      await sendVerificationEmail(
        email,
        verificationLink,
        "Verify Your Email",
        "Please verify your email by clicking the following link:"
      );
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

  // Login user
  async loginWithEmail(uid: string): Promise<void> {
    try {
      await User.findOneAndUpdate(
        { userId: uid },
        {
          $set: {
            active: true,
            lastSeen: moment().tz("Africa/Cairo").toISOString(),
          },
        }
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to login user"
      );
    }
  }

  // Login user
  async loginWithPhone(mobile: string): Promise<UserDtoType | null> {
    try {
      const userLogin = await User.findOneAndUpdate(
        { mobile: mobile },
        {
          $set: {
            active: true,
            lastSeen: moment().tz("Africa/Cairo").toISOString(),
          },
        },
        { new: true }
      ).select("password email mobile role userId");
      return userLogin;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to login user"
      );
    }
  }

  // Verify email
  async verifyEmail(uid: string): Promise<void> {
    try {
      const userDataString = (await client.get(`userId:${uid}`)) ?? "";
      if (!userDataString) {
        throw new Error("User not found in cache");
      }
      const userData = JSON.parse(userDataString);
      userData.dateOfJoining = new Date(userData.dateOfJoining);
      userData.lastSeen = new Date(userData.lastSeen);

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
