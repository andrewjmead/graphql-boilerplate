import getUserId from '../utils/getUserId'

export const Query = {
    async me(obj, args, ctx, info) {
        const userId = getUserId(ctx)
        return ctx.db.query.user({ where: { id: userId } }, info)
    },
    async posts(obj, { page = 1, pageSize = 10 }, ctx, info) {
        const first = pageSize
        const skip = (page - 1) * pageSize

        return ctx.db.query.posts({ first, skip, orderBy: 'createdAt_DESC', where: { published: true } }, info)
    },
    async drafts(obj, { page = 1, pageSize = 10 }, ctx, info) {
        const userId = getUserId(ctx)
        const first = pageSize
        const skip = (page - 1) * pageSize

        return ctx.db.query.posts({ first, skip, orderBy: 'updatedAt_DESC', where: { published: false, author: { id: userId } } }, info)
    }
}