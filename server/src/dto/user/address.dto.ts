import { z } from "zod";

export const AddressDto = z.object({
  userId: z.string(),
  street: z.string(),
  suite: z.string(),
  houseNumber: z.number(),
  city: z.string(),
  governorate: z.string(),
  phone: z.string(),
  type: z.string(),
  isDefault: z.boolean().default(false),
});

export const AddressAddDto = AddressDto.pick({
  street: true,
  suite: true,
  houseNumber: true,
  city: true,
  phone: true,
  type: true,
  isDefault: true,
});

export type AddressDtoType = z.infer<typeof AddressDto>;
export type AddressAddDtoType = z.infer<typeof AddressAddDto>;
