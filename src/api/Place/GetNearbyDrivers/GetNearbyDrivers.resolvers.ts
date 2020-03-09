import { GetNearbyDriversResponse } from "./../../../types/graph.d";
import { IResolvers } from "graphql-tools";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import { Between, getRepository } from "typeorm";

const resolvers: IResolvers = {
  Query: {
    GetNearbyDrivers: privateResolver(
      async (_, __, { request }): Promise<GetNearbyDriversResponse> => {
        const user: User = request.user;
        const { lastLat, lastLng } = user;
        try {
          // Between 등 find 옵션은 Active record에서는 사용 불가
          // All repository and manager find methods accept special options
          const drivers: User[] = await getRepository(User).find({
            isDriving: true,
            lastLat: Between(lastLat - 0.05, lastLat + 0.05),
            lastLng: Between(lastLng - 0.05, lastLng + 0.05)
          });
          return {
            ok: true,
            error: null,
            drivers
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            drivers: null
          };
        }
      }
    )
  }
};

export default resolvers;
