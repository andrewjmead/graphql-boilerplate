import jwt from 'jsonwebtoken'
import uuidv4 from 'uuid/v4'
import bcrypt from 'bcryptjs'

import { prisma } from '../../src/prisma'

// Set up users
const users = [{
    email: 'andrew@example.com',
    name: 'Andrew',
    password: bcrypt.hashSync('andrewpass098!', 10)
}, {
    email: 'isabell@example.com',
    name: 'Isabell',
    password: bcrypt.hashSync('isabellpass098!', 10)
}]

const authTokens = [
    jwt.sign({ _id: users[0]._id }, process.env.JWT_SECRET).toString(),
    jwt.sign({ _id: users[1]._id }, process.env.JWT_SECRET).toString()
]

// Set up posts
const posts = [{
    _id: uuidv4(),
    title: 'First post from Andrew',
    body: 'Post body',
    published: false,
    author: users[0]._id
}, {
    _id: uuidv4(),
    title: 'Second post from Andrew',
    body: 'Post body',
    published: true,
    author: users[0]._id
}, {
    _id: uuidv4(),
    title: 'First post from Isabell',
    body: 'Post body',
    published: true,
    author: users[1]._id
}]

// Set up comments
const firstCommentId = uuidv4()
const comments = [{
    _id: firstCommentId,
    text: 'Comment from Isabell',
    author: users[1]._id,
    post: posts[1]._id
}, {
    _id: uuidv4(),
    text: 'Comment from Andrew to Isabell',
    author: users[0]._id,
    post: posts[1]._id,
    parent: firstCommentId
}, {
    _id: uuidv4(),
    text: 'Comment from Andrew',
    author: users[0]._id,
    post: posts[2]._id
}]

const populateUsers = async () => {
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()
    await Promise.all(
        users.map((user) => {
            return prisma.mutation.createUser({ data: user })
        })
    )

    // await User.remove({})
    // await Promise.all(users.map((user) => {
    //     return new User(user).save()
    // }))
}

const populatePosts = async () => {
    await prisma.mutation.deleteManyPosts()
    // await Promise.all(posts.map((post) => {
    //     return new Post(post).save()
    // }))
}

// const populateComments = async () => {
//     await Comment.remove({})
//     await Promise.all(comments.map((comment) => {
//         return new Comment(comment).save()
//     }))
// }

export { users, populateUsers }
// export { users, populateUsers, posts, populatePosts, comments, populateComments }