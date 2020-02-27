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
          const ride = await Ride.findOne({
            id: args.rideId
          });
          if (ride) {
            if (ride.passengerId === user.id || ride.driverId === user.id) {
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
