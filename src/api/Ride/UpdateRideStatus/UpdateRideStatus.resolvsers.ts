import {
  UpdateRideStatusMutationArgs,
  UpdateRideStatusResponse
} from "./../../../types/graph.d";
import { IResolvers } from "graphql-tools";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import Ride from "../../../entities/Ride";

const resolvers: IResolvers = {
  Mutation: {
    UpdateRideStatus: privateResolver(
      async (
        _,
        args: UpdateRideStatusMutationArgs,
        { req }
      ): Promise<UpdateRideStatusResponse> => {
        const user: User = req.user; // 여기서 유저는 운전자
        if (user.isDriving) {
          try {
            let ride: Ride | undefined;
            if (args.status === "ACCEPTED") {
              // args.status 가 ACCEPTED 경우 REQUESTING 것을 찾아서 ACCEPTED으로 바꾸기위해
              // 상태가 REQUESTING인 ride를 찾는다
              // (상태가 REQUESTING인 ride의 경우 아직 ride에 driver가 설정되어 있지 않은 상태이다)
              ride = await Ride.findOne({
                id: args.rideId,
                status: "REQUESTING"
              });
              if (ride) {
                ride.driver = user;
                user.isTaken = true;
                user.save();
              }
            } else {
              ride = await Ride.findOne({
                id: args.rideId,
                driver: user
              });
            }
            if (ride) {
              ride.status = args.status;
              ride.save();
              return {
                ok: true,
                error: null
              };
            } else {
              return {
                ok: false,
                error: "Cant update ride"
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message
            };
          }
        } else {
          return {
            ok: false,
            error: "You are not driving"
          };
        }
      }
    )
  }
};
export default resolvers;
