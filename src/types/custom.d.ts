import { User } from "./graph";
import { Request } from "express";
import "express";

export interface IGetUserAuthInfoRequest extends Request {
  user?: User;
}

// declare module "express" {
//   export interface Request {
//     user?: User;
//   }
// }

export interface INotNull {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  profilePhoto?: string;
  age?: number;
  name?: string;
  isFav?: boolean;
}
