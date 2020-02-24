import {
  CompletePhoneVerificationMutationArgs,
  CompletePhoneVerificationResponse
} from "./../../../types/graph.d";
import { IResolvers } from "graphql-tools";
import User from "../../../entities/User";
import Verification from "../../../entities/Verification";
import createJWT from "../../../utils/createJWT";

const resolvers: IResolvers = {
  Mutation: {
    CompletePhoneVerification: async (
      _,
      args: CompletePhoneVerificationMutationArgs
    ): Promise<CompletePhoneVerificationResponse> => {
      const { phoneNumber, key } = args;

      // 폰이용 인증절차 진행
      try {
        const verification = await Verification.findOne({
          payload: phoneNumber,
          key
        });
        if (!verification) {
          return {
            ok: false,
            error: "Verification key not valid",
            token: null
          };
        } else {
          verification.verified = true;
          verification.save();
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null
        };
      }

      // 해당 폰번호의 사용자가 있는지 확인 후 인증여부 저장
      try {
        const user = await User.findOne({ phoneNumber });
        if (user) {
          user.verifiedPhoneNumber = true;
          user.save();
          const token: string = createJWT(user.id);
          return {
            ok: true,
            error: null,
            token
          };
        } else {
          return {
            ok: true,
            error: null,
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
