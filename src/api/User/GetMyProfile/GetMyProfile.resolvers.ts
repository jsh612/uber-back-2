import { IResolvers } from "graphql-tools";
import privateResolver from "../../../utils/privateResolver";

const resolvers: IResolvers = {
  Query: {
    GetMyProfile: privateResolver((_, __, { request }) => {
      const { user } = request;
      return {
        ok: true,
        error: null,
        user
      };
    })
  }
};
export default resolvers;
