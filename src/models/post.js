import mongoose from 'mongoose'

// Define schema properties
const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    published: {
        type: Boolean,
        required: true,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    versionKey: false,
    timestamps: true
})

const Post = mongoose.model('Post', PostSchema)

export { Post as default }