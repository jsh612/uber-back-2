// graphql-tools 에 이미 resolver 관련 사항 있음
// 밑에 작성된것과 graphql-tools에 있는 것중 어떤거를 써야하는지 나중에 다시 보기
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
