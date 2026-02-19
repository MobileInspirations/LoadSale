import "dotenv/config";
import { ApolloServer } from "apollo-server";
import { readFileSync } from "fs";
import { join } from "path";
import { resolvers } from "./resolvers";

const typeDefs = readFileSync(join(__dirname, "schema.graphql"), "utf-8");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  context: ({ req }) => ({ req }),
});

const port = process.env.PORT ?? 4000;

server
  .listen({ port })
  .then(({ url }) => {
    console.log(`API ready at ${url}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
