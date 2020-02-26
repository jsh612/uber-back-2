import { GetMyPlacesResponse } from "./../../../types/graph.d";
import { IResolvers } from "graphql-tools";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";

const resolvers: IResolvers = {
  Query: {
    GetMyPlaces: privateResolver(
      async (_, __, { request }): Promise<GetMyPlacesResponse> => {
        try {
          const user = await User.findOne(
            { id: request.user.id },
            { relations: ["places"] }
          );
          if (user) {
            return {
              ok: true,
              places: user.places,
              error: null
            };
          } else {
            return {
              ok: false,
              places: null,
              error: "User not found"
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            places: null
          };
        }
      }
    )
  }
};

export default resolvers;
