import mongoose, { model, Schema } from "mongoose";

const subCategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  _id: { type: String, required: true },
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
  },
  { timestamps: true }
);

// const Category = model<CategoryDtoType>("categories", categorySchema);
const Category = model("categories", categorySchema);
export default Category;
