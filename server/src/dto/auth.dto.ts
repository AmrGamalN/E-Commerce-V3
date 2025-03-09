import { z } from "zod";
import { UserDto } from "./user.dto";

export const RegisterDto = UserDto.pick({
  name: true,
  email: true,
  password: true,
  mobile: true,
  gender: true,
  business: true,
  personal: true,
  coverImage: true,
  paymentOptions: true,
  description: true,
  addressIds: true,
  allowedToShow: true,
  profileImage: true,
});

export const LoginEmailDto = RegisterDto.pick({
  email: true,
  password: true,
});

export const LoginPhoneDto = RegisterDto.pick({
  mobile: true,
  password: true,
});

export type RegisterDtoType = z.infer<typeof RegisterDto>;
