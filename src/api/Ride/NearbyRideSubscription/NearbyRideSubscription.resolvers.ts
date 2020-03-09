import { withFilter } from "graphql-yoga";
import { IResolvers } from "graphql-tools";
import User from "../../../entities/User";

const resolvers: IResolvers = {
  Subscription: {
    NearbyRideSubscription: {
      subscribe: withFilter(
        (_, __, { pubSub }) => pubSub.asyncIterator("rideRequest"), // RequestRide 에서 보내온 데이터 수신
        (payload, _, { context }) => {
          // 여기서 user 는 운전자
          const user: User = context.currentUser;
          const {
            NearbyRideSubscription: { pickUpLat, pickUpLng }
          } = payload;
          const { lastLat: userLastLat, lastLng: userLastLng } = user;
          return (
            pickUpLat >= userLastLat - 0.05 &&
            pickUpLat <= userLastLat + 0.05 &&
            pickUpLng >= userLastLng - 0.05 &&
            pickUpLng <= userLastLng + 0.05
          );
        }
      )
    }
  }
};

export default resolvers;
