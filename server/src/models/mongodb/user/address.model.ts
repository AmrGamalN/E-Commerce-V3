import { model, Schema } from "mongoose";
import { AddressDtoType } from "../../../dto/user/address.dto";

const addressSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  street: { type: String, required: true },
  suite: { type: String, required: true },
  houseNumber: { type: Number, required: true },
  city: { type: String, required: true },
  governorate: { type: String, required: true },
  phone: { type: String, required: true },
  type: { type: String, required: true },
  isDefault: { type: Boolean, required: true, default: true },
} ,{timestamps:true});

const Address = model<AddressDtoType>("addresses", addressSchema);
export default Address;
