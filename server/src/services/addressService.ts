import Address from "../models/mongodb/address.model";
import { AddressDtoType, AddressDto } from "../dto/address.dto";

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
    data: AddressDtoType,
    userId: string
  ): Promise<AddressDtoType> {
    try {
      const parsed = AddressDto.safeParse(data);
      if (!parsed.success) {
        throw new Error("Invalid address data");
      }
      const address = await Address.create({ ...parsed.data, userId });
      await address.save();
      return address;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error adding address"
      );
    }
  }

  // Get Address by addressId and userId
  async getAddress(addressId: string, userId: string): Promise<AddressDtoType> {
    try {
      const retrievedAddress = await Address.findOne({
        _id: addressId,
        userId: userId,
      });

      if (retrievedAddress == null) {
        throw new Error("Address not found");
      }
      const parsed = AddressDto.safeParse(retrievedAddress);

      if (!parsed.success) {
        throw new Error("Invalid address data");
      }
      const address = { _id: retrievedAddress?._id, ...parsed.data };
      return address;
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

      const addressDto = retrievedAddress.map((address) => {
        const { _id, ...addresses } = address.toObject();
        const parsed = AddressDto.safeParse(addresses);
        if (!parsed.success) {
          throw new Error("Invalid address data");
        }
        return { _id, ...parsed.data };
      });
      return addressDto;
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
    data: AddressDtoType
  ): Promise<AddressDtoType | null> {
    try {
      const parsed = AddressDto.safeParse(data);
      if (!parsed.success) {
        throw new Error("Invalid address data");
      }

      const updatedAddress = await Address.findOneAndUpdate(
        {
          _id: addressId,
          userId: userId,
        },
        {
          $set: parsed.data,
        },
        { new: true, runValidators: true }
      );

      return updatedAddress ? updatedAddress.toObject() : null;
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
