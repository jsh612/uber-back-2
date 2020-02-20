export const typeDefs = ["type Query {\n  sayBye: String!\n  sayHello(name: String!): sayHelloRes!\n}\n\ntype sayHelloRes {\n  text: String!\n  error: Boolean!\n}\n"];
/* tslint:disable */

export interface Query {
  sayBye: string;
  sayHello: sayHelloRes;
}

export interface SayHelloQueryArgs {
  name: string;
}

export interface sayHelloRes {
  text: string;
  error: boolean;
}
