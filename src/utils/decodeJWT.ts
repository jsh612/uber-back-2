import jwt from "jsonwebtoken";
import User from "../entities/User";

const decodedJWT = async (token: string): Promise<User | undefined> => {
  // passport 사용시 passport.authenticate 을 직접 구현해 보는 것임.
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_TOKEN || "");
    const { id } = decoded;
    const user = await User.findOne({ id });
    return user;
  } catch (error) {
    return;
  }
};

export default decodedJWT;
