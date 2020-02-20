// graphql-tools 에 이미 resolver 관련 사항 있음 참고
// https://www.apollographql.com/docs/graphql-tools/resolvers/#resolver-map
export type Resolver = (parent: any, args: any, context: any, info: any) => any;

export interface Resolvers {
  // [key: string] -> indexable types
  //  https://www.typescriptlang.org/docs/handbook/interfaces.html#indexable-types
  //  https://www.logicbig.com/tutorials/misc/typescript/indexable-types.html
  [key: string]: {
    [key: string]: Resolver;
  };
}
