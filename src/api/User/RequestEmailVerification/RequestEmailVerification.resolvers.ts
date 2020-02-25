// import { sendVerificationEmail } from "./../../../utils/sendEmail";
import {
  RequestEmailVerificationResponse,
  User
} from "./../../../types/graph.d";
import { IResolvers } from "graphql-tools";
import privateResolver from "../../../utils/privateResolver";
import Verification from "../../../entities/Verification";

const resolvers: IResolvers = {
  Mutation: {
    RequestEmailVerification: privateResolver(
      async (_, __, { request }): Promise<RequestEmailVerificationResponse> => {
        const user: User = request.user;
        if (user.email) {
          try {
            const oldVerification = await Verification.findOne({
              payload: user.email
            });
            if (oldVerification) {
              oldVerification.remove();
            }
            const newVerification = await Verification.create({
              payload: user.email,
              target: "EMAIL"
            }).save();
            console.log("이메일 확인 요청", newVerification);
            // 이메일 보내는건 돈나오니깐 주석처리
            // if(user.fullName) {
            //   await sendVerificationEmail(user.fullName, newVerification.key);
            // }
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
        } else {
          return {
            ok: false,
            error: "인증되 이메일이 없습니다."
          };
        }
      }
    )
  }
};

export default resolvers;
