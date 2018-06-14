import expect from 'expect'
import gql from 'graphql-tag'
import jwt from 'jsonwebtoken'

import { client } from './utils/client'
import { server } from '../src/server'
import { prisma } from '../src/prisma'
import { users, populateUsers } from './utils/seed'
// import { users, populateUsers, posts, populatePosts, comments, populateComments } from './utils/seed'

let serverInstance
beforeAll(async () => {
    serverInstance = await server.start({
        port: process.env.PORT || 3000
    })
})
afterAll(async () => {
    await serverInstance.close()
})

// TODO - I can snapshot ids and stuff like this with asymmetric matcher: https://facebook.github.io/jest/docs/en/snapshot-testing.html

beforeEach(populateUsers)
// beforeEach(populateComments)

it('should login', async () => {
    const variables = {
        email: 'andrew@example.com',
        password: 'andrewpass098!'
    }
    const mutation = gql`
        mutation ($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                token
                user {
                    id
                }
            }
        }
    `

    // Check that the token is valid for there id
    // Check that the email matches up (could via db) (can't via rseponse data)
    // Check that the name lines up

    const { data } = await client.mutate({ mutation, variables })
    const { userId } = jwt.verify(data.login.token, process.env.JWT_SECRET)
    expect(data.login.user.id).toBe(userId)
})

it('should create a new user account', async () => {
    const variables = {
        email: 'newmember@example.com',
        password: 'andrewpass098!',
        name: 'Andrew'
    }
    const mutation = gql`
        mutation ($email: String!, $password: String!, $name: String!) {
            signup(email: $email, password: $password, name: $name) {
                token
                user {
                    id
                }
            }
        }
    `


    const { data } = await client.mutate({ mutation, variables })
    const { userId } = jwt.verify(data.signup.token, process.env.JWT_SECRET)
    expect(data.signup.user.id).toBe(userId)

    const exists = await prisma.exists.User({ id: userId, email: variables.email, name: variables.name })
    expect(exists).toBeTruthy()


    // expect(data.signup.user.name).toBe(variables.name)
})

it('should create a new post', async () => {
    const user = await prisma.query.user({ where: { email: 'andrew@example.com' } })
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)

    const variables = {
        title: 'post title',
        body: 'post body'
    }
    const mutation = gql`
        mutation($title: String!, $body: String!) {
            createPost(title: $title, body: $body) {
                id
                title
                body
                published
                author {
                    name
                }
            }
        }
    `
    const { data } = await client.mutate({ mutation, variables, context: { headers: { "Authorization": `Bearer ${token}` } } })
    // Assertion about what comes back
    const exists = await prisma.exists.Post({ id: data.createPost.id, title: data.createPost.title, body: data.createPost.body })
    expect(exists).toBeTruthy()
})

it('should deny new post unless authenticated',  async (done) => {
    const variables = {
        title: 'post title',
        body: 'post body'
    }
    const mutation = gql`
        mutation($title: String!, $body: String!) {
            createPost(title: $title, body: $body) {
                id
                title
                body
                published
                author {
                    name
                }
            }
        }
    `

    try {
        await client.mutate({ mutation, variables })
        // expected to never get here
    } catch (e) {
        done()
    }
})

// it('should create a new account', async () => {
//     const variables = {
//         email: 'new@example.com',
//         name: 'Some user',
//         password: 'password123abc'
//     }
//     const mutation = gql`
//         mutation ($name: String!, $email: String!, $password: String!) {
//             signup(name: $name, email: $email, password: $password) {
//                 _id
//                 email
//                 name
//             }
//         }
//     `

//     const response = await client.mutate({ mutation, variables })
//     expect(response.data.signup.email).toBe(variables.email)
//     expect(response.data.signup.name).toBe(variables.name)
// })


it('should not create a new account if invalid email')
it('should not create a new account if invalid password')









// it('should return the hello greeting', async () => {
//     const query = gql`
//         query {
//             hello
//         }
//     `
//     const response = await client.query({ query })
//     expect(response.data.hello).toBe('Hello!')
// })

// it('should increase the count over time', (done) => {
//     const query = gql`
//         subscription {
//             count
//         }
//     `
//     client.subscribe({
//         query
//     }).subscribe({
//         next(response) {
//             expect(response.data.count).toBe(0)
//             done()
//         }
//     });
// })