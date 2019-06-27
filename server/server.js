const { prisma } = require('./restaurant-menu-demo/generated/prisma-client')
const { ApolloServer, gql } = require('apollo-server');

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type MenuItem {
    id: String
    imageURL: String
    name: String
    price: Float
  }

  type MenuCategory {
    name: String
    menuItems: [MenuItem]
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    allMenuItems: [MenuItem]
    MenuItem(id: String): MenuItem
  }

  type Mutation {
    addMenuItem(name: String, price: Float, imageURL: String): MenuItem,
    updateMenuItem(id: String, name: String, price: Float, imageURL: String): MenuItem
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    allMenuItems: async () => await prisma.menuItems(),
    MenuItem: async(parent, {id}, context) => await prisma.menuItem({id: id})
  },
  Mutation: {
    addMenuItem: async (parent, data) =>  {
      return await prisma.createMenuItem(data);
    },
    updateMenuItem: async (parent, data) => {
      const ID = data.id;
      delete data.id
      return await prisma.updateMenuItem({
        data: data,
        where: {id: ID}
      })
    }
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});