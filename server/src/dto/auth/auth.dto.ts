import { z } from "zod";
import { UserDto } from "../user/user.dto";

export const RegisterEmailDto = UserDto.pick({
  gender: true,
  business: true,
  personal: true,
  coverImage: true,
  paymentOptions: true,
  description: true,
  addressIds: true,
  allowedToShow: true,
  profileImage: true,
}).extend({
  mobile: z.string().optional().default(""),
  name: z.string(),
  email: z.string().trim().email("PLEASE ENTER A VALID EMAIL"),
  password: z.string(),
});

export const RegisterPhoneDto = RegisterEmailDto.pick({
  name: true,
  email: true,
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
}).extend({
    password: z.string(),
});

export const LoginEmailDto = RegisterEmailDto.pick({
  email: true,
  password: true,
});

export const LoginPhoneDto = RegisterPhoneDto.pick({
  mobile: true,
  password: true,
});

export type RegisterDtoType = z.infer<typeof RegisterEmailDto>;
