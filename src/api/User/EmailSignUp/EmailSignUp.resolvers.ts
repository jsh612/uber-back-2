import { sendSecretMail } from "./../../../utils/sendEmail";
// import { sendVerificationEmail } from "./../../../utils/sendEmail";
import {
  EmailSignUpMutationArgs,
  EmailSignUpResponse
} from "./../../../types/graph.d";
import { IResolvers } from "graphql-tools";
import User from "../../../entities/User";
import createJWT from "../../../utils/createJWT";
import Verification from "../../../entities/Verification";

const resolvers: IResolvers = {
  Mutation: {
    EmailSignUp: async (
      _,
      args: EmailSignUpMutationArgs
    ): Promise<EmailSignUpResponse> => {
      const { email, phoneNumber } = args;
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return {
            ok: false,
            error: "이미 가입되어 있습니다. 로그인 하세요",
            token: null
          };
        } else {
          const phoneVerification = await Verification.findOne({
            payload: phoneNumber,
            verified: true
          });
          if (phoneVerification) {
            const newUser = await User.create({ ...args }).save();
            if (newUser.email) {
              const emailVerification = await Verification.create({
                payload: newUser.email,
                target: "EMAIL"
              }).save();
              console.log("이메일 인증, 메일가입 리졸버", emailVerification);
              // // email 인증
              // await sendVerificationEmail(
              //   newUser.fullName,
              //   emailVerification.key
              // );

              // sendGrid로 메일보내기
              sendSecretMail("urijsh612@gmail.com", emailVerification.key);
            }
            const token = createJWT(newUser.id);
            return {
              ok: true,
              error: null,
              token
            };
          } else {
            return {
              ok: false,
              error: "You haven't verified your phone number",
              token: null
            };
          }
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
