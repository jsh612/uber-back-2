// import { sendVerificationSMS } from "./../../../utils/sendSMS";
import Verification from "../../../entities/Verification";
import {
  StartPhoneVerificationMutationArgs,
  StartPhoneVerificationResponse
} from "../../../types/graph";
import { IResolvers } from "graphql-tools";

const resolvers: IResolvers = {
  Mutation: {
    StartPhoneVerification: async (
      _,
      args: StartPhoneVerificationMutationArgs
    ): Promise<StartPhoneVerificationResponse> => {
      const { phoneNumber } = args;
      try {
        const existingVerification = await Verification.findOne({
          payload: phoneNumber
        });
        if (existingVerification) {
          existingVerification.remove();
        }
        const newVerification = await Verification.create({
          payload: phoneNumber,
          target: "PHONE"
        }).save();
        console.log("폰인증::::", newVerification);
        // 돈나가니깐 실제 문자보내는건 안한다.
        // await sendVerificationSMS(newVerification.payload, newVerification.key);
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
  }
};

export default resolvers;
