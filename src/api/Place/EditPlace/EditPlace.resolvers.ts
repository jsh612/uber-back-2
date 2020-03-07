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

              // 입력값 중 placeId는 Place 타입에 정의되어 있지 않기떄문에, cleanNullArgs에서 같이 걸러준다.
              // 그렇지 않을 경우 placeId 도 업데이트 자료에 포함되어 전체가 없데이트 안되는 것 같다.
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
