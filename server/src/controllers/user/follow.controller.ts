import { Request, Response } from "express";
import FollowService from "../../services/user/follow.service";

class FollowController {
  private static Instance: FollowController;
  private serviceInstance: FollowService;
  constructor() {
    this.serviceInstance = FollowService.getInstance();
  }

  public static getInstance(): FollowController {
    if (!FollowController.Instance) {
      FollowController.Instance = new FollowController();
    }
    return FollowController.Instance;
  }

  // Add a new follow
  async addFollow(req: Request, res: Response): Promise<void> {
    const addFollow = await this.serviceInstance.addFollow(req.user, req.body);
    if (addFollow) {
      res.status(200).json(addFollow);
      return;
    }
    res.status(200).json(addFollow);
  }

  // Get Follow
  async getFollow(req: Request, res: Response): Promise<void> {
    const { typeFollow } = req.body;
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
    const followId = req.params.id;
    const retrievedFollow = await this.serviceInstance.getFollow(
      userId,
      String(typeFollow),
      String(followId)
    );
    if (retrievedFollow == null) {
      res.status(404).json({ message: "Not found Follow", data: [] });
      return;
    }
    res.status(200).json({
      message: "Follow get Successfully",
      data: retrievedFollow,
    });
  }

  // Get all follow
  async getAllFollow(req: Request, res: Response): Promise<void> {
    const { typeFollow } = req.body;
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
    const { page } = req.query;
    const retrievedFollow = await this.serviceInstance.getAllFollow(
      userId,
      String(typeFollow),
      Number(page)
    );

    const count = await this.serviceInstance.countFollow(userId, typeFollow);
    if (retrievedFollow.length == 0) {
      res.status(200).json({ message: `Not found ${typeFollow}`, data: [] });
      return;
    }

    const totalPages = Math.ceil(count / 10);
    const remainPages = totalPages - Number(page);
    const totalFollow =
      typeFollow === "follower" ? "totalFollower" : "totalFollowing";

    res.status(200).json({
      message: `get ${typeFollow} successfully`,
      followInfo: {
        currentPage: isNaN(Number(page)) || Number(page) < 1 ? 1 : page,
        totalPages: totalPages,
        [totalFollow]: count,
        remainPages: remainPages > 0 ? remainPages : 0,
        itemsPerPage: 10,
      },
      data: retrievedFollow,
    });
  }

  // Delete follow
  async deleteFollow(req: Request, res: Response): Promise<void> {
    const { typeFollow } = req.body;
    const followId = req.params.id;
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
    const retrievedFollow = await this.serviceInstance.deleteFollow(
      userId,
      String(typeFollow),
      String(followId)
    );
    if (retrievedFollow == false) {
      res.status(404).json({ message: `Not found ${typeFollow}`, data: [] });
      return;
    }
    res
      .status(200)
      .json({ message: `${typeFollow} deleted successfully`, data: [] });
  }

  // Count of Follow
  async countFollow(req: Request, res: Response): Promise<void> {
    const { typeFollow } = req.body;
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
    const count = await this.serviceInstance.countFollow(userId, typeFollow);
    if (count == 0) {
      res.status(404).json({ message: `Not found ${typeFollow}`, data: 0 });
      return;
    }
    res.status(200).json({
      message: `Count ${typeFollow} fetched successfully`,
      data: count,
    });
  }

  // Search for a follow
  async searchFollow(req: Request, res: Response): Promise<void> {
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
    const { name, typeFollow } = req.body;
    const { page } = req.query;
    const result = await this.serviceInstance.searchFollow(
      userId,
      name,
      typeFollow,
      Number(page)
    );

    if (result.length == 0) {
      res.status(404).json({ message: `Not found ${typeFollow}`, data: [] });
      return;
    }

    res.status(200).json({
      message: `Search for ${typeFollow} fetched successfully`,
      data: result,
    });
  }
}

export default FollowController;
