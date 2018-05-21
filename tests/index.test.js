import expect from 'expect'
import gql from 'graphql-tag'
import { client } from './utils/client'

// Start up the yoga server
import '../src/index'

it('should return the hello greeting', async () => {
    const query = gql`
        query {
            hello
        }
    `
    const response = await client.query({ query })
    expect(response.data.hello).toBe('Hello!')
})

it('should increase the count over time', (done) => {
    const query = gql`
        subscription {
            count
        }
    `
    client.subscribe({
        query
    }).subscribe({
        next(response) {
            expect(response.data.count).toBe(0)
            done()
        }
    });
})