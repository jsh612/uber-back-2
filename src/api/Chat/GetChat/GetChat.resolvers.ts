import { GetChatQueryArgs, GetChatResponse } from "./../../../types/graph.d";
import { IResolvers } from "graphql-tools";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import Chat from "../../../entities/Chat";

const resolvers: IResolvers = {
  Query: {
    GetChat: privateResolver(
      async (
        _,
        args: GetChatQueryArgs,
        { request }
      ): Promise<GetChatResponse> => {
        const user: User = request.user;
        try {
          const chat = await Chat.findOne(
            {
              id: args.chatId
            },
            { relations: ["messages", "driver", "passenger"] }
          );
          if (chat) {
            if (chat.passengerId === user.id || chat.driverId === user.id) {
              return {
                ok: true,
                error: null,
                chat
              };
            } else {
              return {
                ok: false,
                error: "Not authorized to see this chat",
                chat: null
              };
            }
          } else {
            return {
              ok: false,
              error: "Not found",
              chat: null
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            chat: null
          };
        }
      }
    )
  }
};

export default resolvers;
