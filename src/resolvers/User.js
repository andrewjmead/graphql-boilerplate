import getUserId from '../utils/getUserId'

export const User = {
    posts: {
        fragment: `fragment UserId on User { id }`,
        async resolve(obj, args, ctx, info) {
            return await ctx.db.query.posts({ where: { published: true, author: { id: obj.id } } })
        }
    },
    email: {
        fragment: `fragment UserId on User { id }`,
        async resolve(parent, args, ctx, info) {
            try {
                const userId = getUserId(ctx)
                return parent.id === userId ? parent.email : null
            } catch (e) {
                return null
            }
        },
    },
}