import {
  UpdateMyProfileMutationArgs,
  UpdateMyProfileResponse
} from "./../../../types/graph.d";
import { IResolvers } from "graphql-tools";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import cleanNullArgs from "../../../utils/cleanNullArgs";

const resolvers: IResolvers = {
  Mutation: {
    UpdateMyProfile: privateResolver(
      async (
        _,
        args: UpdateMyProfileMutationArgs,
        { request }
      ): Promise<UpdateMyProfileResponse> => {
        const user: User = request.user;
        const notNull = cleanNullArgs(args);
        if (args.password !== null) {
          // 값 변경 후 save()를 해야 User.ts의 @BeforeUpdate() 가 작동한다.
          user.password = args.password;
          user.save();

          // 비밀번호는 별로도 변경시킬 것이므로, 비밀버호가 중복으로 업데이트 되지 않도록 passowrd 키를 지워 버린다.
          delete notNull.password;
        }
        try {
          await User.update({ id: user.id }, { ...notNull }); // update는 .save() 불필요
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
