const resolvers = {
    Query: {
        hello: () => 'Hello!'
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