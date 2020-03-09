import { GetNearbyRideResponse } from "../../../types/graph";
import { IResolvers } from "graphql-tools";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import { Between } from "typeorm";
import Ride from "../../../entities/Ride";

const resolvers: IResolvers = {
  Query: {
    GetNearbyRide: privateResolver(
      async (_, __, { request }): Promise<GetNearbyRideResponse> => {
        // 운전자가 승객 찾기
        const user: User = request.user; // 여기서 user는 운전자
        if (user.isDriving) {
          const { lastLat, lastLng } = user;
          try {
            // const ride = await getRepository(Ride).findOne(
            //   {
            //     status: "REQUESTING",
            //     pickUpLat: Between(lastLat - 0.05, lastLat + 0.05),
            //     pickUpLng: Between(lastLng - 0.05, lastLng + 0.05)
            //   },
            //   { relations: ["passenger"] }
            // );
            // 위와 동일 (굳이 getRepository 사용할 필요는 없음)
            const ride = await Ride.findOne(
              {
                status: "REQUESTING",
                pickUpLat: Between(lastLat - 0.05, lastLat + 0.05),
                pickUpLng: Between(lastLng - 0.05, lastLng + 0.05)
              },
              { relations: ["passenger"] }
            );
            if (ride) {
              return {
                ok: true,
                error: null,
                ride
              };
            } else {
              return {
                ok: true,
                error: null,
                ride: null
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              ride: null
            };
          }
        } else {
          return {
            ok: false,
            error: "You are not driver",
            ride: null
          };
        }
      }
    )
  }
};

export default resolvers;
