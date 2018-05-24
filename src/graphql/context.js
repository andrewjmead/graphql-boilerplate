import { PubSub } from 'graphql-yoga'
import User from '../models/user'

const pubsub = new PubSub()

const context = async (req) => {
    let token = req.request ? req.request.headers.authorization : req.connection.context.authorization
    let user

    if (token) {
        user = await User.findByToken(token)
    }

    return { pubsub, user }
}

export { context }