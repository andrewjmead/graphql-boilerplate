const fs = require('fs')
const path = require('path')
const { GraphQLServer, PubSub } = require('graphql-yoga')

// GraphQL resolvers and schema
const { resolvers } = require('./graphql/resolvers')
const schema = fs.readFileSync(path.join(__dirname, './graphql/schema.gql')).toString()

// Define the GraphQL server
const server = new GraphQLServer({
    typeDefs: schema,
    resolvers
})

server.start({
    port: process.env.PORT || 3000
}, ({ port }) => {
    console.log(`Server is running on port ${port}`)
})