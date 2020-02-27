import {
  RequestRideMutationArgs,
  RequestRideResponse
} from "./../../../types/graph.d";
import { IResolvers } from "graphql-tools";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import Ride from "../../../entities/Ride";

const resolvers: IResolvers = {
  Mutation: {
    RequestRide: privateResolver(
      async (
        _,
        args: RequestRideMutationArgs,
        { request, pubSub }
      ): Promise<RequestRideResponse> => {
        const user: User = request;
        try {
          const ride: Ride = await Ride.create({
            ...args,
            passenger: user
          }).save();
          pubSub.publish("rideRequest", { NearbyRideSubscription: ride });
          return {
            ok: true,
            error: null,
            ride
          };
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
