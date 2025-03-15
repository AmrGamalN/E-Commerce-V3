import { z } from "zod";

const typeSchema = z.object({
  name: z.string().optional(),
  _id: z.string().optional(),
});

const subcategorySchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    name: z.string().min(1, "Subcategory name is required"),
    _id: z.string(),
    types: z.array(typeSchema).default([]),
    brands: z.array(typeSchema).default([]),
    subcategories: z.array(subcategorySchema).default([]),
  })
);

export const CategoryDto = z.object({
  name: z.string().min(1, "Name is required"),
  subcategories: z.array(subcategorySchema).default([]),
  visits: z.number().default(0).optional(),
});

export type CategoryDtoType = z.infer<typeof CategoryDto>;
