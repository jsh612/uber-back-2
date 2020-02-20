import { GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";
// import path from "path";

const allTypes: GraphQLSchema[] = fileLoader(
  // path.join(__dirname, "./api/**/*.graphql")
  "./api/**/*.graphql"
);

const allResovers: any[] = fileLoader(
  // path.join(__dirname, "./api/**/*.resolvers.*")
  "./api/**/*.resolvers.*"
);

const schema = makeExecutableSchema({
  typeDefs: mergeTypes(allTypes),
  resolvers: mergeResolvers(allResovers)
});

export default schema;
