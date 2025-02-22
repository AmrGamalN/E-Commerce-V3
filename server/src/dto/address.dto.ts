import { z } from "zod";

export const AddressDto = z.object({
  street: z.string(),
  suite: z.string(),
  houseNumber: z.number(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  phone: z.string(),
  type: z.string(),
  isDefault: z.boolean().default(false),
});

export type AddressDtoType = z.infer<typeof AddressDto>;
