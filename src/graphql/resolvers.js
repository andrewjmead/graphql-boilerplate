import User from '../models/user'

const resolvers = {
    Query: {
        hello: () => 'Hello!'
    },
    Mutation: {
        async signup(obj, { email, password }, context) {
            const user = new User({ email, password })
            await user.save()
            return user.clean()
        },
        async login(obj, { email, password }, context) {
            const user = await User.findByCredentials(email, password)
            const authToken = user.generateAuthToken()

            return {
                ...user.clean(),
                authToken
            }
        }
    },
    Subscription: {
        count: {
            subscribe(obj, args, { pubsub }) {
                return pubsub.asyncIterator('COUNT')
            }
        }
    }
}

export { resolvers }