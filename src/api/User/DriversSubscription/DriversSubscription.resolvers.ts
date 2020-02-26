import { IResolvers } from "graphql-tools";

const resolvers: IResolvers = {
  Subscription: {
    DriversSubscription: {
      subscribe: (_, __, { pubSub }) => {
        // 해당 subscription은 driverUpdate 라는 채널의 감시를 시작한다.
        return pubSub.asyncIterator("driverUpdate");
      }
    }
  }
};

export default resolvers;
