export const Subscription = {
    comments: {
        async subscribe(obj, { postId }, { pubsub }) {
            // const post = await Post.findById(postId)

            // if (!post) {
            //     throw new Error('Unable to suscribe to post comments')
            // }

            // return pubsub.asyncIterator(`COMMENTS_FOR_${post._id}`)
        }
    }
}