import{ model, Schema } from "mongoose";
import { CategoryDtoType } from "../../../dto/category/category.dto";

const subCategorySchema: Schema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  brands: [
    {
      name: { type: String, required: true },
      _id: { type: String, required: true },
    },
  ],
  types: [
    {
      name: { type: String, required: true },
      _id: { type: String, required: true },
    },
  ],
  subcategories: [this],
});

const categorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    subcategories: [subCategorySchema],
    visits: { type: Number, default: 0, required: false },
  },
  { timestamps: true }
);

const Category = model<CategoryDtoType>("categories", categorySchema);
export default Category;
