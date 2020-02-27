import { IResolvers } from "graphql-tools";
import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";

const resolvers: IResolvers = {
  Subscription: {
    DriversSubscription: {
      subscribe: withFilter(
        (_, __, { pubSub }) => {
          // 해당 subscription은 driverUpdate 라는 채널의 감시를 시작한다.
          // ReportMovemnet와 연계해서 보기
          return pubSub.asyncIterator("driverUpdate");
        },
        (payload, _, { context }) => {
          // (payload, _, context ) => {
          // console.log("payload", payload); // 전달하고자하는 데이터  DriversSubscription: User{유저 정보}
          // console.log("context", context); // context.context-> currentUser 정보
          // 콘솔값 -> 구글문서  필기에 작성되있음.
          // return true;

          const user: User = context.currentUser;
          const {
            DriversSubscription: {
              lastLat: driverLastLat,
              lastLng: driverLastLng
            }
          } = payload;
          const { lastLat: userLastLat, lastLng: userLastLng } = user;
          return (
            driverLastLat >= userLastLat - 0.05 &&
            driverLastLat <= userLastLat + 0.05 &&
            driverLastLng >= userLastLng - 0.05 &&
            driverLastLng <= userLastLng + 0.05
          );
        }
      )
    }
  }
};

export default resolvers;
