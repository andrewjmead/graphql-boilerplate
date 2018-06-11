import getUserId from '../../utils/getUserId'

export const post = {
    async createPost(obj, { title, body }, ctx, info) {
        const userId = getUserId(ctx)
        const data = {
            title,
            body,
            published: false,
            author: {
                connect: { id: userId }
            }
        }
        return ctx.db.mutation.createPost({ data }, info)
    },
    async editPost(obj, { id, title, body, published }, ctx, info) {
        const userId = getUserId(ctx)
        const exists = await ctx.db.exists.Post({ id, author: { id: userId } })
        const isPublished = await ctx.db.exists.Post({ id, published: true, author: { id: userId } })

        if (!exists) {
            throw new Error('Post not found')
        }

        if (isPublished && published === false) {
            await ctx.db.mutation.deleteManyComments({ where: { post: { id } } })
        }

        return ctx.db.mutation.updatePost({ where: { id }, data: { title, body, published } }, info)
    },
    async deletePost(obj, { id }, ctx, info) {
        const userId = getUserId(ctx)
        const exists = await ctx.db.exists.Post({ id, author: { id: userId } })

        if (!exists) {
            throw new Error('Post not found')
        }

        await ctx.db.mutation.deleteManyComments({ where: { post: { id } } })
        // Can't query relational data until this is fixed: https://github.com/prismagraphql/prisma/issues/2347
        return ctx.db.mutation.deletePost({ where: { id } }, info)
    }
}