import fs from 'fs'
import path from 'path'
import { GraphQLServer } from 'graphql-yoga'
import { PubSub } from 'graphql-yoga'

import './config'
import { resolvers, fragmentReplacements } from './resolvers/index'
import { prisma } from './prisma'

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    fragmentReplacements,
    context: req => ({ ...req, db: prisma, pubsub }),
})

export { server } 