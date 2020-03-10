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
        const user: User = request.user;
        if (!user.isRiding && !user.isDriving) {
          try {
            const ride = await Ride.create({ ...args, passenger: user }).save();
            pubSub.publish("rideRequest", { NearbyRideSubscription: ride }); // NearbyRideSubscription으로 데이터 전송
            user.isRiding = true;
            user.save();
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
        } else {
          return {
            ok: false,
            error: "You can't request two rides or drive and request",
            ride: null
          };
        }
      }
    )
  }
};
export default resolvers;
