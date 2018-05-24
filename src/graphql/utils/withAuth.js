const withAuth = (callback) => {
    return (obj, args, context) => {
        if (context.user) {
            return callback(obj, args, context)
        } else {
            throw new Error('Authentication required')
        }
    }
}

export { withAuth }