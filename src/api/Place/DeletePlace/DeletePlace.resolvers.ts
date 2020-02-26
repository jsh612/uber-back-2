import {
  DeletePlaceMutationArgs,
  DeletePlaceResponse
} from "./../../../types/graph.d";
import { IResolvers } from "graphql-tools";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import Place from "../../../entities/Place";

const resolvers: IResolvers = {
  Mutation: {
    DeletePlace: privateResolver(
      async (
        _,
        args: DeletePlaceMutationArgs,
        { request }
      ): Promise<DeletePlaceResponse> => {
        const user: User = request.user;
        const { placeId } = args;
        try {
          const place = await Place.findOne({ id: placeId });
          if (place) {
            if (place.userId === user.id) {
              place.remove();
              return {
                ok: true,
                error: null
              };
            } else {
              return {
                ok: false,
                error: "Not Authorized"
              };
            }
          } else {
            return {
              ok: false,
              error: "Place not found"
            };
          }
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
