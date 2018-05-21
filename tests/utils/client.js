import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { createHttpLink } from "apollo-link-http"
import { WebSocketLink } from "apollo-link-ws"
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getMainDefinition } from 'apollo-utilities'
import fetch from 'unfetch'

// Setup the links for the apollo client
const port = process.env.PORT || 3000
const httpLink = createHttpLink({ uri: `http://localhost:${port}/`, fetch })
const cache = new InMemoryCache()
const wsLink = new WebSocketLink({
    uri: `ws://localhost:${port}/`,
    options: {
        reconnect: true
    }
})

// Configure apollo split to use multiple links
const link = ApolloLink.split(
    // Pick which links get the data based on the operation kind
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLink,
);

// Create the client
const client = new ApolloClient({
    link: link,
    cache
})

export { client }