import {
  EmailSignUpMutationArgs,
  EmailSignUpResponse
} from "./../../../types/graph.d";
import { IResolvers } from "graphql-tools";
import User from "../../../entities/User";

const resolvers: IResolvers = {
  Mutation: {
    EmailSignUp: async (
      _,
      args: EmailSignUpMutationArgs
    ): Promise<EmailSignUpResponse> => {
      const { email } = args;
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return {
            ok: false,
            error: "이미 가입되어 있습니다. 로그인 하세요",
            token: null
          };
        } else {
          await User.create({ ...args }).save();
          return {
            ok: true,
            error: null,
            token: "곧 해결"
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