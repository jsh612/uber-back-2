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
        if (args.password) {
          // 주석처리 된데로 하면 프로필 변경 처리후 재차 로그인시 오류 발생한다.
          // 값 변경 후 save()를 해야 User.ts의 @BeforeUpdate() 가 작동한다.
          // user.password = args.password;
          // user.save();
          user.password = await user.hashPassword(args.password);
          user.save();
          // 비밀번호는 별로도 변경시킬 것이므로, 비밀버호가 중복으로 업데이트 되지 않도록 passowrd 키를 지워 버린다.
          delete notNull.password;
        }
        try {
          await User.update({ id: user.id }, { ...notNull }); // update는 .save() 불필요
          console.log("update 프로필::", await User.findOne({ id: user.id }));
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
