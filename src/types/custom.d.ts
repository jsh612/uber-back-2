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
