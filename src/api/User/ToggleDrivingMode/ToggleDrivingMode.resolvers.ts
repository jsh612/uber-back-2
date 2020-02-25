import { ToggleDrivingModeResponse } from "./../../../types/graph.d";
import { IResolvers } from "graphql-tools";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";

const resolvers: IResolvers = {
  Mutation: {
    ToggleDrivingMode: privateResolver(
      async (_, __, { request }): Promise<ToggleDrivingModeResponse> => {
        const user: User = request.user; // User는 entities의 User
        user.isDriving = !user.isDriving;
        user.save();
        return {
          ok: true,
          error: null
        };
      }
    )
  }
};

export default resolvers;
