import { UserDto } from "../dto/user.dto";
import User from "../models/mongodb/user.model";
import { auth } from "../config/firebaseConfig";
import { client } from "../config/redisConfig";
import { sendVerificationEmail } from "../utils/sendEmail";
import { RegisterDtoType } from "../dto/auth.dto";
import { UserDtoType } from "../dto/user.dto";
import moment from "moment-timezone";
import bcrypt from "bcrypt";
import { formatDataAdd } from "../utils/dataFormatter";

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
  async registerUser(data: RegisterDtoType): Promise<void> {
    try {
      const userRegister = await auth.createUser({
        phoneNumber: data.mobile,
        password: data.password,
        email: data.email,
      });

      const user = new User({
        ...data,
        password: await bcrypt.hash(data.password, 10),
        userId: userRegister.uid,
        dateOfJoining: new Date().toISOString(),
      });

      const { _id, ...userData } = user.toObject();
      formatDataAdd(userData, UserDto);

      // Store user data in caching and send verification to verify email
      const verificationLink = await auth.generateEmailVerificationLink(
        data.email
      );
      await sendVerificationEmail(
        data.email,
        verificationLink,
        "Verify Your Email",
        "Please verify your email by clicking the following link:"
      );
      await client.setEx(
        `userId:${userRegister.uid}`,
        3600,
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
      await User.updateOne(
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
      ).select(
        "password email mobile role userId numberLogin lastFailedLoginTime"
      );
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
      // Get user data from redis caching
      const userDataString = (await client.get(`userId:${uid}`)) ?? "";
      if (!userDataString) {
        throw new Error("User not found in cache");
      }

      // Update user data in mongodb and save & Delete from caching
      const userData = JSON.parse(userDataString);
      userData.dateOfJoining = new Date(userData.dateOfJoining);
      userData.lastSeen = new Date(userData.lastSeen);
      const parsed = formatDataAdd(userData, UserDto);

      await User.create({ ...parsed });
      await client.del(`userId:${uid}`);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Email verification failed"
      );
    }
  }
}

export default AuthService;
