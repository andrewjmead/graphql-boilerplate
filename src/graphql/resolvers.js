import User from '../models/user'
import Post from '../models/post'
import Comment from '../models/comment'
import { withAuth } from './withAuth'

const resolvers = {
    Query: {
        user: async (obj, args, { user }) => {
            return user
        },
        posts: async (obj, { showOwnPosts }, { user }) => {
            if (user && showOwnPosts) {
                // If you're logged in an want to see your own posts
                return Post.find({ author: user._id })
            } else {
                // If you're not logged in
                return Post.find({ published: true })
            }
        }
    },
    User: {
        posts: async (obj, args, { user }) => {
            const query = { author: obj._id }

            if (!user || obj._id !== user._id) {
                // If you're looking at someone elses posts
                query.published = true
            }

            return Post.find(query)
        }
    },
    Post: {
        author: async (obj, args, context) => {
            return User.findById(obj.author)
        },
        comments: async (obj, args, context) => {
            return Comment.find({ post: obj._id })
        }
    },
    Comment: {
        parent: async (obj, args, context) => {
            return Comment.findOne({ _id: obj.parent })
        },
        author: async (obj, args, context) => {
            return User.findById(obj.author)
        },
        post: async (obj, args, context) => {
            return Post.findById(obj.post)
        }
    },
    Mutation: {
        async signup(obj, { name, email, password }, context) {
            const user = new User({ name, email, password })
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
        },
        createPost: withAuth(async (obj, { title, body }, { user }) => {
            const post = new Post({ title, body, author: user._id })
            await post.save()
            return post
        }),
        editPost: withAuth(async (obj, { _id, title, body, published }, { user }) => {
            const post = await Post.findOne({ _id, author: user._id })

            if (!post) throw new Error('Unable to find post')

            // Require a title and body before a post can be published
            if (typeof title === 'string') post.title = title
            if (typeof body === 'string') post.body = body
            if (typeof published === 'boolean') post.published = published

            await post.save()
            return post
            
        }),
        deletePost: withAuth(async (obj, { _id }, { user }) => {
            const post = await Post.findOneAndRemove({ _id, author: user._id })
            
            if (!post) throw new Error('Unable to find post')

            return post
        }),
        createComment: withAuth(async (obj, { postId, parentId, text }, { user }) => {
            const post = await Post.findOne({ _id: postId, published: true })

            if (!post) throw new Error('Unable to find post')

            const comment = new Comment({ post: postId, text, author: user._id })

            if (typeof parentId === 'string') comment.parent = parentId

            await comment.save()
            return comment
        }),
        editComment: withAuth(async (obj, { _id, text }, { user }) => {
            const comment = await Comment.findOne({ _id, author: user._id })

            if (!comment) throw new Error('Unable to find comment')

            comment.text = text

            await comment.save()
            return comment
        }),
        deleteComment: withAuth(async (obj, { _id }, { user }) => {
            const comment = await Comment.findOneAndRemove({ _id, author: user._id })

            if (!comment) throw new Error('Unable to find comment')

            return comment
        }),
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