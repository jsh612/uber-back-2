import { GetRideQueryArgs, GetRideResponse } from "./../../../types/graph.d";
import { IResolvers } from "graphql-tools";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import Ride from "../../../entities/Ride";

const resolvers: IResolvers = {
  Query: {
    GetRide: privateResolver(
      async (
        _,
        args: GetRideQueryArgs,
        { request }
      ): Promise<GetRideResponse> => {
        const user: User = request.user; // 유저는 운전자 또는 승객 둘다.
        try {
          const ride = await Ride.findOne(
            {
              id: args.rideId
            },
            { relations: ["driver", "passenger"] }
          );
          if (ride) {
            if (ride.passengerId === user.id || ride.driverId === user.id) {
              // if (!ride.driverId) {
              //   // driver가 아직 운행여부를 수행하지 않았을 경우 드라이버에 대한 정보가
              //   // Frontend로 전달되지 않아 오류가 발생하므로, 다음과 같이 임시값 설정
              //   ride.driver.id = 0;
              //   ride.driver.lastName = "대기중";
              //   ride.driver.firstName = "";
              //   ride.driver.profilePhoto = "";
              //   ride.save();
              // }
              return {
                ok: true,
                error: null,
                ride
              };
            } else {
              return {
                ok: false,
                error: "Not Authorized",
                ride: null
              };
            }
          } else {
            return {
              ok: false,
              error: "Ride not found",
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
      }
    )
  }
};

export default resolvers;
