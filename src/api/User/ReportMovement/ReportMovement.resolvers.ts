import {
  ReportMovementMutationArgs,
  ReportMovementResponse
} from "./../../../types/graph.d";
import { IResolvers } from "graphql-tools";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import cleanNullArgs from "../../../utils/cleanNullArgs";

const resolvers: IResolvers = {
  Mutation: {
    ReportMovement: privateResolver(
      async (
        _,
        args: ReportMovementMutationArgs,
        { request, pubSub }
      ): Promise<ReportMovementResponse> => {
        const user: User = request.user;
        const notNull = cleanNullArgs(args);
        try {
          await User.update({ id: user.id }, { ...notNull });
          // .pubhlish(임의 채널이름, subscription의 graphql에 작성된 것)
          pubSub.publish("driverUpdate", { DriversSubscription: user });
          return {
            ok: true,
            error: null
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message
          };
        }
      }
    )
  }
};

export default resolvers;
