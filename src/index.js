import fs from 'fs'
import path from 'path'
import { GraphQLServer } from 'graphql-yoga'
import { PubSub } from 'graphql-yoga'
import { Prisma } from 'prisma-binding'

import './config/config'
import { resolvers, fragmentReplacements } from './resolvers/index'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4467',
    secret: 'my-super-secret-secret',
    fragmentReplacements
})

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    fragmentReplacements,
    context: req => ({ ...req, db: prisma, pubsub }),
})

server.start({
    port: process.env.PORT || 3000
}, ({ port }) => {
    console.log(`Server is running on port ${port}`)
})