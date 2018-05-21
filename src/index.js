const fs = require('fs')
const path = require('path')
const { GraphQLServer, PubSub } = require('graphql-yoga')

// GraphQL resolvers and schema
const { resolvers } = require('./graphql/resolvers')
const schema = fs.readFileSync(path.join(__dirname, './graphql/schema.gql')).toString()

// Setup pub/sub for subscriptions
const pubsub = new PubSub()

// Demo subscription change
let count = 0
setInterval(() => {
    pubsub.publish('COUNT', { count: count++ })
}, 1000)

// Define the GraphQL server
const server = new GraphQLServer({
    typeDefs: schema,
    resolvers,
    context: {
        pubsub
    }
})

server.start({
    port: process.env.PORT || 3000
}, ({ port }) => {
    console.log(`Server is running on port ${port}`)
})