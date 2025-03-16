import { Request, Response } from "express";
import PaymentService from "../../services/payment/payment.service";

class PaymentController {
  private static Instance: PaymentController;
  private serviceInstance: PaymentService;
  constructor() {
    this.serviceInstance = PaymentService.getInstance();
  }

  public static getInstance(): PaymentController {
    if (!PaymentController.Instance) {
      PaymentController.Instance = new PaymentController();
    }
    return PaymentController.Instance;
  }

  // Get user PaymentOption
  async getPaymentOption(req: Request, res: Response): Promise<void> {
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
    const retrievedPayment = await this.serviceInstance.getPaymentOption(
      userId
    );
    if (retrievedPayment.paymentOptions.length === 0) {
      res.status(404).json({ message: "Not found Payment", data: [] });
      return;
    }
    res
      .status(200)
      .json({ message: "Payment get Successfully", data: retrievedPayment });
  }

  //   // Add payment
  //   async addPayment(req: Request, res: Response): Promise<void> {
  //     const userId = req.user?.user_id;
  //     const retrievedPayment = await this.serviceInstance.addPayment(
  //       req.body,
  //       userId
  //     );
  //     if (!retrievedPayment) {
  //       res.status(400).json({ message: "Failed to add payment" });
  //       return;
  //     }
  //     res.status(200).json({ message: "Payment added Successfully" });
  //   }

  //   // Get all payment
  //   async getAllPayment(req: Request, res: Response): Promise<void> {
  //     const userId = req.body.userId ? req.body.userId : req.user?.user_id;
  //     const retrievedPayment = await this.serviceInstance.getAllPayment(userId);
  //     const count = await this.serviceInstance.countPayment();
  //     if (retrievedPayment.length == 0) {
  //       res.status(200).json({ message: "Not found Payment", data: [] });
  //       return;
  //     }
  //     res.status(200).json({
  //       count: count,
  //       message: "Payment get Successfully",
  //       data: retrievedPayment,
  //     });
  //   }

  //   // Update payment
  //   async updatePayment(req: Request, res: Response): Promise<void> {
  //     const { id } = req.params;
  //     const userId = req.user?.user_id;
  //     const retrievedPayment = await this.serviceInstance.updatePayment(
  //       String(id),
  //       userId,
  //       req.body
  //     );
  //     if (retrievedPayment == null) {
  //       res.status(404).json(retrievedPayment);
  //       return;
  //     }
  //     res.status(200).json(retrievedPayment);
  //   }

  //   // Count of Payment
  //   async countPayment(req: Request, res: Response): Promise<void> {
  //     const count = await this.serviceInstance.countPayment();
  //     if (count == 0) {
  //       res.status(404).json({ message: "Not found Payment", data: 0 });
  //       return;
  //     }
  //     res.status(200).json({
  //       message: "Count payment fetched successfully",
  //       data: count,
  //     });
  //   }

  //   // Delete payment
  //   async deletePayment(req: Request, res: Response): Promise<void> {
  //     const { id } = req.params;
  //     const userId = req.user?.user_id;
  //     const retrievedPayment = await this.serviceInstance.deletePayment(
  //       String(id),
  //       userId
  //     );
  //     if (retrievedPayment == 0) {
  //       res.status(404).json({ message: "Not found payment" });
  //       return;
  //     }
  //     res.status(200).json({ message: "Payment deleted successfully" });
  //   }
}
export default PaymentController;
