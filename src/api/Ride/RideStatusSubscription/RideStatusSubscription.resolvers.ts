import { withFilter } from "graphql-yoga";
import { IResolvers } from "graphql-tools";
import User from "../../../entities/User";

const resolvers: IResolvers = {
  Subscription: {
    RideStatusSubscription: {
      subscribe: withFilter(
        (_, __, { pubSub }) => pubSub.asyncIterator("rideUpdate"),
        (payload, _, { context }) => {
          const user: User = context.currentUser;
          const {
            RideStatusSubscription: { driverId, passengerId }
          } = payload;
          return user.id === driverId || user.id === passengerId;
        }
      )
    }
  }
};

export default resolvers;
