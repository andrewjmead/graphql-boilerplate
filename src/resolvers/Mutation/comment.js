import getUserId from '../../utils/getUserId'

export const comment = {
    async createComment(obj, { postId, parentId, text }, ctx, info) {
        const userId = getUserId(ctx)
        const postExists = await ctx.db.exists.Post({ id: postId, published: true })

        if (!postExists) {
            throw new Error('Post not found')
        }

        const data = {
            text,
            author: {
                connect: { id: userId }
            },
            post: {
                connect: { id: postId }
            }
        }

        if (parentId) {
            const parentCommentExists = await ctx.db.exists.Comment({ id: parentId })

            if (!parentCommentExists) {
                throw new Error('Parent comment not found')
            }

            data.parent = {
                connect: { id: parentId }
            }
        }

        // TODO - publish 
        // pubsub.publish(`COMMENTS_FOR_${comment.post}`, {comments: comment})

        return ctx.db.mutation.createComment({ data }, info)
    },
    async editComment(obj, { id, text }, ctx, info) {
        const userId = getUserId(ctx)
        const exists = await ctx.db.exists.Comment({ id, author: { id: userId } })

        if (!exists) {
            throw new Error('Post not found')
        }

        return ctx.db.mutation.updateComment({ where: { id }, data: { text } }, info)
    },
    async deleteComment(obj, { id }, ctx, info) {
        const userId = getUserId(ctx)
        const isAuthor = await ctx.db.exists.Comment({ id, author: { id: userId } })
        const isPostOwner = await ctx.db.exists.Comment({ id, post: { author: { id: userId } } })

        if (!isAuthor && !isPostOwner) {
            throw new Error('Comment not found')
        }

        // Can't query relational data until this is fixed: https://github.com/prismagraphql/prisma/issues/2347
        return ctx.db.mutation.deleteComment({ where: { id } }, info)
    }
}