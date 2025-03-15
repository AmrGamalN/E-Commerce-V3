import Address from "../../models/mongodb/user/address.model";
import {
  AddressDtoType,
  AddressDto,
  AddressAddDtoType,
  AddressAddDto,
} from "../../dto/user/address.dto";
import {
  formatDataAdd,
  formatDataGetAll,
  formatDataGetOne,
  formatDataUpdate,
} from "../../utils/dataFormatter";
import mongoose from "mongoose";

class AddressService {
  private static Instance: AddressService;
  constructor() {}
  public static getInstance(): AddressService {
    if (!AddressService.Instance) {
      AddressService.Instance = new AddressService();
    }
    return AddressService.Instance;
  }

  // Add address
  async addAddress(
    data: AddressAddDtoType,
    userId: string
  ): Promise<AddressAddDtoType> {
    try {
      const parsed = formatDataAdd(data, AddressAddDto);
      return await Address.create({ ...parsed, userId });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error adding address"
      );
    }
  }

  // Get Address by addressId and userId
  async getAddress(addressId: string, userId: string): Promise<AddressDtoType> {
    try {
      const retrievedAddress = await Address.findById({
        _id: new mongoose.Types.ObjectId(addressId),
        userId: userId,
      }).lean();
      return formatDataGetOne(retrievedAddress, AddressDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching address"
      );
    }
  }

  // Get all address by userId
  async getAllAddress(userId: string): Promise<AddressDtoType[]> {
    try {
      const retrievedAddress = await Address.find({
        userId: userId,
      });
      return formatDataGetAll(retrievedAddress, AddressDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching address"
      );
    }
  }

  // Update address
  async updateAddress(
    addressId: string,
    userId: string,
    data: AddressAddDtoType
  ): Promise<number> {
    try {
      const parsed = formatDataUpdate(data, AddressAddDto);
      const updatedAddress = await Address.updateOne(
        {
          _id: addressId,
          userId: userId,
        },
        {
          $set: parsed,
        }
      );
      return updatedAddress.matchedCount;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error updating address"
      );
    }
  }

  // Count of Address
  async countAddress(): Promise<number> {
    try {
      const count = await Address.countDocuments();
      return count;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching address count"
      );
    }
  }

  // Delete address
  async deleteAddress(addressId: string, userId: string): Promise<Number> {
    try {
      const deletedAddress = await Address.deleteOne({
        _id: addressId,
        userId: userId,
      });
      return deletedAddress.deletedCount;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error deleting address"
      );
    }
  }
}

export default AddressService;
