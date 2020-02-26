import {
  EditPlaceMutationArgs,
  EditPlaceResponse
} from "./../../../types/graph.d";
import { IResolvers } from "graphql-tools";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import Place from "../../../entities/Place";
import cleanNullArgs from "../../../utils/cleanNullArgs";

const resolvers: IResolvers = {
  Mutation: {
    EditPlace: privateResolver(
      async (
        _,
        args: EditPlaceMutationArgs,
        { request }
      ): Promise<EditPlaceResponse> => {
        const user: User = request.user;
        const { placeId } = args;
        try {
          const place = await Place.findOne({ id: placeId });
          // 특정 place의 relation 도 함께 로드하는 방법
          // await Place.findOne({ id: placeId }, relations: ["user"]);
          if (place) {
            if (place.userId === user.id) {
              const notNull = cleanNullArgs(args);
              await Place.update({ id: placeId }, { ...notNull });
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
