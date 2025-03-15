import { User } from "../../models/mongodb/user/user.model";
import Follow from "../../models/mongodb/user/follow.model";
import {
  FollowDtoType,
  FollowDto,
  FollowAddDtoType,
  FollowAddDto,
} from "../../dto/user/follow.dto";
import {
  formatDataAdd,
  formatDataGetAll,
  formatDataGetOne,
} from "../../utils/dataFormatter";
import { Security } from "../../models/mongodb/user/userSecurity.model";

class FollowService {
  private static Instance: FollowService;
  constructor() {}
  public static getInstance(): FollowService {
    if (!FollowService.Instance) {
      FollowService.Instance = new FollowService();
    }
    return FollowService.Instance;
  }

  // Used to add follow to ite or conversation
  async addFollow(user: any, data: FollowAddDtoType): Promise<object> {
    try {
      formatDataAdd(data, FollowAddDto);
      if (user?.user_id === data.followingId) {
        return { message: "Not allow to following your account" };
      }

      // Check if the user is already following
      // Check if the follow already exists
      const [existingFollow, userFollowing] = await Promise.all([
        Follow.exists({
          followerId: user?.user_id,
          followingId: data.followingId,
        }),
        Security.findOne({ userId: data.followingId }).select("name").lean(),
      ]);

      if (existingFollow) return { message: "Already following this account" };
      if (!userFollowing) return { message: "User not found" };

      // Update both follower and following count in the User model
      await this.updateFollow(user?.user_id, data.followingId, 1);

      // Create a new follow
      return await Follow.create({
        followerId: user?.user_id,
        followingName: userFollowing?.name,
        followingId: data.followingId,
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching follow"
      );
    }
  }

  // Update both follower and following count in the User model
  private async updateFollow(
    followerId: string,
    followingId: string,
    value: number
  ): Promise<void> {
    await User.bulkWrite([
      {
        updateOne: {
          filter: { userId: followerId }, // Find the user who is following
          update: { $inc: { following: value } }, // Increment their following count
        },
      },
      {
        updateOne: {
          filter: { userId: followingId }, // Find the user who is being followed
          update: { $inc: { followers: value } }, // Increment their followers count
        },
      },
    ]);
  }

  // Get Follow by itemId or conversationId and userId
  // Get follower if type Follow is follower , get following if type Follow is following
  // Using type Follow because not repeat get with follower and following
  async getFollow(
    userId: string,
    typeFollow: string,
    followId: string
  ): Promise<FollowDtoType> {
    try {
      const query: any =
        typeFollow === "follower"
          ? { followerId: userId, _id: followId }
          : { followingId: userId, _id: followId };
      const retrievedFollow = await Follow.findById(query).lean();
      return formatDataGetOne(retrievedFollow, FollowDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : `Error fetching ${typeFollow}`
      );
    }
  }

  // Get all [follower or following] based on type Follow
  async getAllFollow(
    userId: string,
    typeFollow: string,
    page: number
  ): Promise<FollowDtoType[]> {
    try {
      page = isNaN(page) || page < 1 ? 1 : page;
      const query: any =
        typeFollow === "follower"
          ? { followerId: userId }
          : { followingId: userId };
      const retrievedFollow = await Follow.find(query)
        .skip((page - 1) * 10)
        .limit(10)
        .lean();
      return formatDataGetAll(retrievedFollow, FollowDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : `Error fetching ${typeFollow}`
      );
    }
  }

  // Count [follower or following] based on typeFollow
  async countFollow(userId: string, typeFollow: string): Promise<number> {
    try {
      const query: any =
        typeFollow === "follower"
          ? { followerId: userId }
          : { followingId: userId };
      const count = await Follow.countDocuments(query);
      return count;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : `Error fetching ${typeFollow} count`
      );
    }
  }

  // Delete [follower or following] based on typeFollow
  async deleteFollow(
    userId: string,
    typeFollow: string,
    followId: string
  ): Promise<boolean> {
    try {
      const query: any =
        typeFollow === "follower"
          ? { followerId: userId, _id: followId }
          : { followingId: userId, _id: followId };
      const deletedFollow = await Follow.findOneAndDelete(query);
      if (!deletedFollow) return false;

      // Update both follower and following count in the User model
      await this.updateFollow(
        deletedFollow.followerId,
        deletedFollow.followingId,
        -1
      );

      return true;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : `Error deleting ${typeFollow}`
      );
    }
  }

  async searchFollow(
    userId: string,
    name: string,
    typeFollow: string,
    page: number
  ): Promise<FollowDtoType[]> {
    try {
      page = isNaN(page) || page < 1 ? 1 : page;
      const query =
        typeFollow === "follower"
          ? {
              followerId: userId,
              followingName: { $regex: name, $options: "i" },
            }
          : {
              followingId: userId,
              followingName: { $regex: name, $options: "i" },
            };
      const retrievedFollow = await Follow.find(query)
        .skip((page - 1) * 10)
        .limit(10)
        .lean();

      const followDto = retrievedFollow.map((follow) => {
        const { _id, ...follows } = follow;
        const parsed = FollowDto.safeParse(follows);
        if (!parsed.success) {
          throw new Error("Invalid follow data");
        }
        return { _id, ...parsed.data };
      });
      return followDto;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : `Error fetching ${typeFollow}`
      );
    }
  }
}

export default FollowService;
