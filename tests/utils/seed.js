import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import User from '../../src/models/user'
import Post from '../../src/models/post'
import Comment from '../../src/models/comment'

const ObjectId = mongoose.Types.ObjectId


// Set up users
const users = [{
    _id: new ObjectId(),
    email: 'andrew@example.com',
    name: 'Andrew',
    password: 'andrewpass098!'
}, {
    _id: new ObjectId(),
    email: 'isabell@example.com',
    name: 'Isabell',
    password: 'isabellpass098!'
}]

const authTokens = [
    jwt.sign({ _id: users[0]._id }, process.env.JWT_SECRET).toString(),
    jwt.sign({ _id: users[1]._id }, process.env.JWT_SECRET).toString()
]

// Set up posts
const posts = [{
    _id: new ObjectId(),
    title: 'First post from Andrew',
    body: 'Post body',
    published: false,
    author: users[0]._id
}, {
    _id: new ObjectId(),
    title: 'Second post from Andrew',
    body: 'Post body',
    published: true,
    author: users[0]._id
}, {
    _id: new ObjectId(),
    title: 'First post from Isabell',
    body: 'Post body',
    published: true,
    author: users[1]._id
}]

// Set up comments
const firstCommentId = new ObjectId()
const comments = [{
    _id: firstCommentId,
    text: 'Comment from Isabell',
    author: users[1]._id,
    post: posts[1]._id
}, {
    _id: new ObjectId(),
    text: 'Comment from Andrew to Isabell',
    author: users[0]._id,
    post: posts[1]._id,
    parent: firstCommentId
}, {
    _id: new ObjectId(),
    text: 'Comment from Andrew',
    author: users[0]._id,
    post: posts[2]._id
}]

const populateUsers = async () => {
    await User.remove({})
    await Promise.all(users.map((user) => {
        return new User(user).save()
    }))
}

const populatePosts = async () => {
    await Post.remove({})
    await Promise.all(posts.map((post) => {
        return new Post(post).save()
    }))
}

const populateComments = async () => {
    await Comment.remove({})
    await Promise.all(comments.map((comment) => {
        return new Comment(comment).save()
    }))
}

export { users, populateUsers, posts, populatePosts, comments, populateComments }