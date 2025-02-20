import { z } from "zod";

const typeSchema = z.object({
  name: z.string().optional(),
  _id: z.string().optional(),
});

const subcategorySchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    name: z.string(),
    _id: z.string(),
    types: z.array(typeSchema).default([]),
    brands: z.array(typeSchema).default([]),
    subcategories: z.array(subcategorySchema).default([]),
  })
);

export const CategoryDto = z.object({
  name: z.string(),
  subcategories: z.array(subcategorySchema).default([]),
});

export type CategoryDtoType = z.infer<typeof CategoryDto>;
