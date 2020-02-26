import dotenv from "dotenv";
dotenv.config();

import { Options } from "graphql-yoga";
import { createConnection } from "typeorm";
import app from "./app";
import connectionOptions from "./ormConfig";
import decodedJWT from "./utils/decodeJWT";

// console.log(process.env);

const PORT: number | string = process.env.PORT || 4000;
const PLAYGROUND_ENDPOINT: string = "/playground";
const GRAPHQL_ENDPOINT: string = "/graphql";
const SUBSCRIPTION_ENDPOINT: string = "/subscription";

const appOptions: Options = {
  port: PORT,
  playground: PLAYGROUND_ENDPOINT,
  endpoint: GRAPHQL_ENDPOINT,
  subscriptions: {
    path: SUBSCRIPTION_ENDPOINT,
    onConnect: async connectionParams => {
      // console.log("index.ts의 connectionParams", connectionParams);
      // 콘솔로그로 확인시 playground의 주소를 /subscription 로 변경
      // 결과(http의 Header 같은 느낌)
      // connectionParams {
      //   'X-JWT': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTgyNzA0NDMzfQ.EOMmqnfaEpqmrP96I7ioxvbV4a4T9wDRf9lRENNjR08'
      // }
      const token = connectionParams["X-JWT"];
      if (token) {
        const user = await decodedJWT(token);
        if (user) {
          return {
            //  The user object found will be available as context.currentUser in your GraphQL resolvers.
            currentUser: user
          };
        }
      }
      throw new Error("No JWT. Can't subscribe");
    }
  }
};

const handleAppStart = (): void =>
  console.log(`서버: http://localhost:${PORT}${PLAYGROUND_ENDPOINT}`);

createConnection(connectionOptions).then(() => {
  app.start(appOptions, handleAppStart);
});
