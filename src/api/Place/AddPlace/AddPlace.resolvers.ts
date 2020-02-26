import {
  AddPlaceMutationArgs,
  AddPlaceRespons
} from "./../../../types/graph.d";
import { IResolvers } from "graphql-tools";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import Place from "../../../entities/Place";

const resolvers: IResolvers = {
  Mutation: {
    AddPlace: privateResolver(
      async (
        _,
        args: AddPlaceMutationArgs,
        { request }
      ): Promise<AddPlaceRespons> => {
        const user: User = request.user;
        try {
          await Place.create({ ...args, user }).save();
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
