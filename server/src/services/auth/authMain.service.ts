import VerifyService from "./verify.service";
import RegisterService from "./register.service";
import LoginService from "./login.service";
import SecurityService from "./security.service";
import TwoFactorAuthService from "./twoFactorAuth.service";

class AuthService {
  private static instance: AuthService;
  private registerService?: RegisterService;
  private verifyService?: VerifyService;
  private loginService?: LoginService;
  private securityService?: SecurityService;
  private twoFactorAuthService?: TwoFactorAuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  getRegisterService(): RegisterService {
    if (!this.registerService) {
      this.registerService = RegisterService.getInstance();
    }
    return this.registerService;
  }

  getVerifyService(): VerifyService {
    if (!this.verifyService) {
      this.verifyService = VerifyService.getInstance();
    }
    return this.verifyService;
  }

  getLoginService(): LoginService {
    if (!this.loginService) {
      this.loginService = LoginService.getInstance();
    }
    return this.loginService;
  }

  getSecurityService(): SecurityService {
    if (!this.securityService) {
      this.securityService = SecurityService.getInstance();
    }
    return this.securityService;
  }

  getTwoFactorAuthService(): TwoFactorAuthService {
    if (!this.twoFactorAuthService) {
      this.twoFactorAuthService = TwoFactorAuthService.getInstance();
    }
    return this.twoFactorAuthService;
  }
}
export default AuthService;
