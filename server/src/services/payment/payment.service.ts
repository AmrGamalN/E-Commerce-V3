import Payment from "../../models/mongodb/payment/payment.model";
import {
  PaymentDtoType,
  PaymentDto,
  PaymentUpdateDtoType,
  PaymentUpdateDto,
  UserPaymentDto,
} from "../../dto/payment/payment.dto";
import {
  formatDataAdd,
  formatDataGetAll,
  formatDataGetOne,
  formatDataUpdate,
} from "../../utils/dataFormatter";
import { User } from "../../models/mongodb/user/user.model";
import { UserDto, UserDtoType } from "../../dto/user/user.dto";

class PaymentService {
  private static Instance: PaymentService;
  constructor() {}
  public static getInstance(): PaymentService {
    if (!PaymentService.Instance) {
      PaymentService.Instance = new PaymentService();
    }
    return PaymentService.Instance;
  }

  // Get user PaymentOption
  async getPaymentOption(userId: string): Promise<UserDtoType> {
    try {
      const retrievedPayment = await User.findOne({
        userId: userId,
      })
        .select("paymentOptions")
        .lean();
      return formatDataGetOne(retrievedPayment, UserPaymentDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching payment"
      );
    }
  }

  //   // Add payment
  //   async addPayment(
  //     data: PaymentDtoType,
  //     paymentId: string
  //   ): Promise<PaymentUpdateDtoType> {
  //     try {
  //       const parsed = formatDataAdd(data, PaymentDto);
  //       return await Payment.create({ ...parsed, paymentId });
  //     } catch (error) {
  //       throw new Error(
  //         error instanceof Error ? error.message : "Error adding payment"
  //       );
  //     }
  //   }

  //   // Get Payment by paymentId and paymentId
  //   async getPayment(paymentId: string): Promise<PaymentDtoType> {
  //     try {
  //       const retrievedPayment = await Payment.findById({
  //         _id: new mongoose.Types.ObjectId(paymentId),
  //         paymentId: paymentId,
  //       }).lean();
  //       return formatDataGetOne(retrievedPayment, PaymentDto);
  //     } catch (error) {
  //       throw new Error(
  //         error instanceof Error ? error.message : "Error fetching payment"
  //       );
  //     }
  //   }

  //   // Get all payment by paymentId
  //   async getAllPayment(paymentId: string): Promise<PaymentDtoType[]> {
  //     try {
  //       const retrievedPayment = await Payment.find({
  //         paymentId: paymentId,
  //       });
  //       return formatDataGetAll(retrievedPayment, PaymentDto);
  //     } catch (error) {
  //       throw new Error(
  //         error instanceof Error ? error.message : "Error fetching payment"
  //       );
  //     }
  //   }

  //   // Update payment
  //   async updatePayment(
  //     paymentId: string,
  //     data: PaymentUpdateDtoType
  //   ): Promise<number> {
  //     try {
  //       const parsed = formatDataUpdate(data, PaymentUpdateDto);
  //       const updatedPayment = await Payment.updateOne(
  //         {
  //           _id: paymentId,
  //           paymentId: paymentId,
  //         },
  //         {
  //           $set: parsed,
  //         }
  //       );
  //       return updatedPayment.matchedCount;
  //     } catch (error) {
  //       throw new Error(
  //         error instanceof Error ? error.message : "Error updating payment"
  //       );
  //     }
  //   }

  //   // Count of Payment
  //   async countPayment(): Promise<number> {
  //     try {
  //       const count = await Payment.countDocuments();
  //       return count;
  //     } catch (error) {
  //       throw new Error(
  //         error instanceof Error ? error.message : "Error fetching payment count"
  //       );
  //     }
  //   }

  //   // Delete payment
  //   async deletePayment(paymentId: string): Promise<Number> {
  //     try {
  //       const deletedPayment = await Payment.deleteOne({
  //         _id: paymentId,
  //         paymentId: paymentId,
  //       });
  //       return deletedPayment.deletedCount;
  //     } catch (error) {
  //       throw new Error(
  //         error instanceof Error ? error.message : "Error deleting payment"
  //       );
  //     }
  //   }
}

export default PaymentService;
