import mongoose from 'mongoose'

// Define schema properties
const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }
}, {
    versionKey: false
})

const Comment = mongoose.model('Comment', CommentSchema)

export { Comment as default }