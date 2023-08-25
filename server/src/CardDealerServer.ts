// GraphQL type and query definitions
// Note: These are example types. You should replace them with what you need
export const typeDefs = `#graphql
  type ExampleObject {
    foo: String
    bar: Boolean
  }

  type Query {
    exampleObjects: [ExampleObject]
  }
`;

// GraphQL query logic
// Note: These are example queries. You should replace them with what you need
export const resolvers = {
  Query: {
    exampleObjects: () => {
      return [
        { foo: "Lorem ipsum", bar: true },
        { foo: "Ipsum lorem", bar: false },
      ];
    },
  },
};
