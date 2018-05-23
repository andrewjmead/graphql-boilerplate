import User from '../models/user'
import Post from '../models/post'
import { withAuth } from './withAuth'

const resolvers = {
    Query: {
        hello: () => 'Hello!',
        user: withAuth(async (obj, args, { user }) => {
            return user
        }),
        posts: withAuth(async (obj, args, { user }) => {
            return Post.find({ author: user._id })
        }),
        publicPosts: withAuth(async (obj, args, { user }) => {
            return Post.find({ published: true })
        })
    },
    User: {
        posts: withAuth(async (obj, args, { user }) => {
            return Post.find({ author: user._id })
        })
    },
    Post: {
        author: withAuth(async (obj, args, context) => {
            return User.findById(obj.author)
        })
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
        })
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