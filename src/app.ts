import { IGetUserAuthInfoRequest } from "./types/custom.d";
import { Response, NextFunction } from "express";
import cors from "cors";
import { GraphQLServer, PubSub } from "graphql-yoga";
import helmet from "helmet";
import logger from "morgan";
import schema from "./api/schema";
import decodedJWT from "./utils/decodeJWT";

class App {
  public app: GraphQLServer;
  public pubSub: any;
  constructor() {
    this.app = new GraphQLServer({
      schema,
      // context --> app이 resolver에게 정보를 전달 할때 사용(이 정보는 모든 resolver에서 사용가능)
      context: ({ request }) => ({ request, pubSub: this.pubSub })
    });
    this.middlewares();

    // pubSub -> Publish Subscription의 약자
    this.pubSub = new PubSub();
    this.pubSub.ee.setMaxListeners(99); // 그냥 오류 해결을 위한 것일뿐. 의미는 모르겠음.
  }

  private middlewares = (): void => {
    this.app.express.use(cors());
    this.app.express.use(helmet());
    this.app.express.use(logger("dev"));
    this.app.express.use(this.jwt);
  };

  private jwt = async (
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // X-JWT
    // 이름은 상관없음, 프론트엔드에서 req 헤더에 전달할 이름과 같기만 하면된다.
    const token = req.get("X-JWT");
    if (token) {
      const user = await decodedJWT(token);
      if (user) {
        // user를 req에 붙이기
        req.user = user;
      } else {
        req.user = undefined;
      }
    }
    next();
  };
}

export default new App().app;
