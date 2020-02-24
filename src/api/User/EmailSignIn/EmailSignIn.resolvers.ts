import {
  EmailSignInResponse,
  EmailSignInMutationArgs
} from "./../../../types/graph.d";
import { IResolvers } from "graphql-tools";
import User from "../../../entities/User";
import createJWT from "../../../utils/createJWT";

const resolvers: IResolvers = {
  Mutation: {
    EmailSignIn: async (
      _,
      args: EmailSignInMutationArgs
    ): Promise<EmailSignInResponse> => {
      const { email, password } = args;
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return {
            ok: false,
            error: "해당 email의 유저가 없습니다.",
            token: null
          };
        }
        const checkPassword = await user.comparePassword(password);
        if (checkPassword) {
          const token: string = createJWT(user.id);
          return {
            ok: true,
            error: null,
            token
          };
        } else {
          return {
            ok: false,
            error: "비밀번호 틀림",
            token: null
          };
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null
        };
      }
    }
  }
};

export default resolvers;
