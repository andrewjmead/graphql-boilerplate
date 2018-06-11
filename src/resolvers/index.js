import { extractFragmentReplacements } from 'prisma-binding'

import getUserId from '../utils/getUserId'
import { Query } from './Query'
import { User } from './User'
import { Subscription } from './Subscription'
import { auth } from './Mutation/auth'
import { post } from './Mutation/post'
import { comment } from './Mutation/comment'

const resolvers = {
    Query,
    User,
    Mutation: {
        ...auth,
        ...post,
        ...comment,
    },
    Subscription
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export { resolvers, fragmentReplacements }