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
        { request }
      ): Promise<ReportMovementResponse> => {
        const user: User = request.User;
        const notNull = cleanNullArgs(args);
        try {
          await User.update({ id: user.id }, { ...notNull });
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
