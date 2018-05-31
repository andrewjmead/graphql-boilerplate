import { PubSub } from 'graphql-yoga'
import User from '../models/user'

const pubsub = new PubSub()

const context = async (req) => {
    let token = req.request ? req.request.headers.authorization : req.connection.context.authorization
    let user
    console.log('token', token)
    if (token) {
        user = await User.findByToken(token)
    }

    return { pubsub, user }
}

export { context }