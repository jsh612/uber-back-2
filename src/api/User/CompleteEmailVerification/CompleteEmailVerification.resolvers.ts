import {
  CompleteEmailVerificationMutationArgs,
  CompleteEmailVerificationResponse
} from "./../../../types/graph.d";
import { IResolvers } from "graphql-tools";
import privateResolver from "../../../utils/privateResolver";
import Verification from "../../../entities/Verification";
import User from "../../../entities/User";

const resolvers: IResolvers = {
  Mutation: {
    CompleteEmailVerification: privateResolver(
      async (
        _,
        args: CompleteEmailVerificationMutationArgs,
        { request }
      ): Promise<CompleteEmailVerificationResponse> => {
        const { key } = args;
        const user: User = request.user; // User 는 entities의 User
        if (user.email) {
          try {
            const verification = await Verification.findOne({
              key,
              payload: user.email
            });
            if (verification) {
              user.verifiedEmail = true;
              user.save();
              return {
                ok: true,
                error: null
              };
            } else {
              return {
                ok: false,
                error: "이메일을 인증할 수 없습니다."
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message
            };
          }
        } else {
          return {
            ok: false,
            error: "인증을 위한 email이 없습니다."
          };
        }
      }
    )
  }
};

export default resolvers;
