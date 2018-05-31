import fs from 'fs'
import path from 'path'
import { GraphQLServer } from 'graphql-yoga'
import { context } from './graphql/context'
import { resolvers } from './graphql/resolvers'

// Start up the database connection
import './config/config'
import './db/db'

// GraphQL schema parser
const typeDefs = fs.readFileSync(path.join(__dirname, './graphql/schema.gql')).toString()

// Define the GraphQL server
const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context
})

server.start({
    port: process.env.PORT || 3000
}, ({ port }) => {
    console.log(`Server is running on port ${port}`)
})