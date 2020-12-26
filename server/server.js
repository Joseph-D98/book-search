const express = require('express');
const path = require('path');
const db = require('./config/connection');
//import apollo server
const { ApolloServer } = require('apollo-server-express');
//typedefs and resolvers from schemas
const { typeDefs, resolvers } = require('./schemas')

const { authMiddleware } = require('./utils/auth')

// const routes = require('./routes'); not needed with graphql

const app = express();
const PORT = process.env.PORT || 3001;
//create a new apollo server and pass schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
})

server.applyMiddleware({ app })

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})


// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    //log where we can go to test gql api
    console.log(`use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
