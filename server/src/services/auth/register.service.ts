import { UserDto } from "../../dto/user/user.dto";
import { User } from "../../models/mongodb/user/user.model";
import { Security } from "../../models/mongodb/user/userSecurity.model";
import { auth } from "../../config/firebaseConfig";
import { client } from "../../config/redisConfig";
import { sendVerificationEmail } from "../../utils/sendEmail";
import { RegisterDtoType } from "../../dto/auth/auth.dto";
import { UserDtoType } from "../../dto/user/user.dto";
import bcrypt from "bcrypt";
import { formatDataAdd } from "../../utils/dataFormatter";
import DashboardService from "../../services/dashboard/dashboard.service";
import AuthService from "./authMain.service";

interface ServiceResponse {
  success: boolean;
  status: number;
  message: string;
  data?: any;
}

class RegisterService {
  private static instance: RegisterService;
  private dashboardService: DashboardService;
  private constructor() {
    this.dashboardService = DashboardService.getInstance();
  }

  public static getInstance(): RegisterService {
    if (!RegisterService.instance) {
      RegisterService.instance = new RegisterService();
    }
    return RegisterService.instance;
  }

  // Register user
  async registerUser(
    typeRegister: string,
    data: RegisterDtoType
  ): Promise<void> {
    try {
      if (typeRegister === "phone") {
        await this.registerByPhone(data);
      } else {
        await this.registerByEmail(data);
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Registration failed"
      );
    }
  }

  // Register by using email
  private async registerByEmail(data: RegisterDtoType): Promise<void> {
    try {
      const userRecord = await auth.createUser({
        email: data.email,
        password: data.password,
      });

      // Store user data in caching and send verification to verify email
      await this.addUserInCaching(data, userRecord.uid, "email");
      const verificationLink = await auth.generateEmailVerificationLink(
        data.email
      );
      await sendVerificationEmail(
        data.email,
        verificationLink,
        "Verify Your Email",
        "Please verify your email by clicking the following link."
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Registration failed"
      );
    }
  }

  // Register by using phone
  private async registerByPhone(data: RegisterDtoType): Promise<void> {
    try {
      // lazy loading
      const authService = AuthService.getInstance();
      const verifyService = authService.getVerifyService();

      const checkExistEmail = await this.checkExistEmail(data.email);
      if (checkExistEmail.success == true) {
        throw new Error(checkExistEmail.message);
      }

      const userRecord = await auth.createUser({
        phoneNumber: data.mobile,
        password: data.password,
      });
      await this.addUserInCaching(data, userRecord.uid, "phone");
      await verifyService.sendOtpAgain(data.mobile, userRecord.uid);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Registration failed"
      );
    }
  }

  // Save user in caching after register
  private async addUserInCaching(
    data: RegisterDtoType,
    userUid: string,
    signWith: "phone" | "email"
  ): Promise<UserDtoType> {
    const userData = Object.assign(
      {},
      data,
      { password: await bcrypt.hash(data.password, 10) },
      { signWith: signWith },
      new User({ userId: userUid }).toObject()
    );

    // Check format data and store user data in caching
    formatDataAdd(userData, UserDto);
    await client.setEx(`userId:${userUid}`, 3600, JSON.stringify(userData));
    return userData;
  }

  // Save data in database after verify email ro phone
  public async saveUserInDatabase(userId: string): Promise<void> {
    try {
      // Get user data from redis caching
      const userDataString = (await client.get(`userId:${userId}`)) ?? "";
      if (!userDataString) {
        throw new Error("Please verify your account");
      }

      // Update user data in mongodb and save & Delete from caching
      const userData = JSON.parse(userDataString);
      const parsed = formatDataAdd(userData, UserDto);

      await User.create({ ...parsed });
      await Security.create({
        userId: parsed?.userId,
        email: parsed?.email,
        name: parsed?.name,
        password: parsed?.password,
        mobile: parsed?.mobile,
        signWith: parsed?.signWith,
        dateOfJoining: new Date(),
        confirmAccount: true,
      });

      // Update dashboard
      const userStats = Object.fromEntries(
        Object.entries({
          newUsersToday: 1,
          inactiveUsers: 1,
          totalAdmins: userData.role === "ADMIN" && 1,
          totalUsers: userData.role !== "ADMIN" && 1,
          totalMen: userData.gender === "male" && 1,
          totalWomen: userData.gender !== "male" && 1,
          totalPersonalAccounts: userData.personal && 1,
          totalBusinessAccounts: !userData.personal && 1,
          totalRegisterWithEmail: userData.signWith === "email" && 1,
          totalRegisterWithPhone: userData.signWith !== "email" && 1,
        }).filter(([_, value]) => value)
      );

      this.dashboardService.updateDashboardRecordsInCaching(userStats);
      await client.del(`userId:${userId}`);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Email verification failed"
      );
    }
  }

  // Check exist email in database before register user by phone
  private async checkExistEmail(email: string): Promise<ServiceResponse> {
    try {
      const user = await Security.findOne({ email });
      return {
        success: !!user,
        status: 200,
        message: "Email exists",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Internal server error"
      );
    }
  }
}

export default RegisterService;
