import expect from 'expect'
import gql from 'graphql-tag'
import { client } from './utils/client'

// Start up the yoga server
import '../src/index'
import { users, populateUsers, posts, populatePosts, comments, populateComments } from './utils/seed'

beforeEach(populateUsers)
beforeEach(populatePosts)
beforeEach(populateComments)

it('should create a new account', async () => {
    const variables = {
        email: 'new@example.com',
        name: 'Some user',
        password: 'password123abc'
    }
    const mutation = gql`
        mutation ($name: String!, $email: String!, $password: String!) {
            signup(name: $name, email: $email, password: $password) {
                _id
                email
                name
            }
        }
    `

    const response = await client.mutate({ mutation, variables })
    expect(response.data.signup.email).toBe(variables.email)
    expect(response.data.signup.name).toBe(variables.name)
})


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