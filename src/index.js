// TODO - Set up some sort of header-based middleware for that token so I can access the user via the content api

import fs from 'fs'
import path from 'path'
import { GraphQLServer, PubSub } from 'graphql-yoga'
import { authMiddleware } from './middleware/auth'
import { UpperCaseDirective, IsUserDirective } from './graphql/directives'

// Start up the database connection
import './db/db'

// GraphQL resolvers and schema
import { resolvers } from './graphql/resolvers'
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
    schemaDirectives: {
        upper: UpperCaseDirective,
        isUser: IsUserDirective
    },
    context({ request }) {
        return {
            pubsub,
            user: request.user            
        }
    }
})

server.express.use(authMiddleware)

server.start({
    port: process.env.PORT || 3000
}, ({ port }) => {
    console.log(`Server is running on port ${port}`)
})