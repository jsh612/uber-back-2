import { User } from "./types/graph.d";
import { Request } from "express";

export interface IGetUserAuthInfoRequest extends Request {
  user?: User;
}
