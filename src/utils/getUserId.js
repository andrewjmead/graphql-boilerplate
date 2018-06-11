import jwt from 'jsonwebtoken'

export default (ctx, silent = false) => {
    const header = ctx.request ? ctx.request.headers.authorization : ctx.connection.context.authorization
    let user

    if (header) {
        const token = header.replace('Bearer ', '')
        const { userId } = jwt.verify(token, process.env.JWT_SECRET)
        return userId
    }

    if (!silent) {
        throw new Error('Please authentication')
    }
}