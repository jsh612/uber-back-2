import {
  UpdateRideStatusMutationArgs,
  UpdateRideStatusResponse
} from "../../../types/graph";
import { IResolvers } from "graphql-tools";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import Ride from "../../../entities/Ride";
import Chat from "../../../entities/Chat";

const resolvers: IResolvers = {
  Mutation: {
    UpdateRideStatus: privateResolver(
      async (
        _,
        args: UpdateRideStatusMutationArgs,
        { request, pubSub }
      ): Promise<UpdateRideStatusResponse> => {
        const user: User = request.user; // 여기서 유저는 운전자
        if (user.isDriving) {
          try {
            let ride: Ride | undefined;
            if (args.status === "ACCEPTED") {
              // args.status 가 ACCEPTED 경우 REQUESTING 것을 찾아서 ACCEPTED으로 바꾸기위해
              // 상태가 REQUESTING인 ride를 찾는다
              // (상태가 REQUESTING인 ride의 경우 아직 ride에 driver가 설정되어 있지 않은 상태이다)
              ride = await Ride.findOne(
                {
                  id: args.rideId,
                  status: "REQUESTING"
                },
                { relations: ["passenger"] }
              );
              if (ride) {
                ride.driver = user;
                user.isTaken = true;
                user.save();
                const chat = await Chat.create({
                  driver: user,
                  passenger: ride.passenger
                }).save();
                ride.chat = chat;
                ride.save();
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

              // 구독자에게 변화 전송
              // .publish(채널이름, .graphql에 작성된 내용 ← 보내고자하는 데이터)
              pubSub.publish("rideUpdate", { RideStatusSubscription: ride });
              return {
                ok: true,
                error: null,
                rideId: ride.id
              };
            } else {
              return {
                ok: false,
                error: "Cant update ride",
                rideId: null
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              rideId: null
            };
          }
        } else {
          return {
            ok: false,
            error: "You are not driving",
            rideId: null
          };
        }
      }
    )
  }
};
export default resolvers;
