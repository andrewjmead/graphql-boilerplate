# GraphQL Boilerplate Project

A GraphQL boilerplate that supports GraphQL, subscriptions, and testing.

This boilerplate was created using [graphql-yoga](https://github.com/prismagraphql/graphql-yoga) for the GraphQL server. The test environment uses [jest](https://github.com/facebook/jest) for the testing framework and [apollo-client](https://github.com/apollographql/apollo-client) to make the GraphQL requests.

## Get Started

1. Clone the repo

2. Run `npm install`

3. Set up a config file. Here's an example for your dev and test environments.

```json
{
    "development": {
        "DATABASE_URL": "mongodb://localhost/graphql-blog-dev",
        "JWT_SECRET": "abc123098!!!"
    },
    "test": {
        "DATABASE_URL": "mongodb://localhost/graphql-blog-test",
        "JWT_SECRET": "abc123098!!!"
    }
}
```

4. Run `npm run dev` to start up the development environment

5. Head over to `localhost:3000` to make some GraphQL requests using GraphQL Playground

## Get Started with Tests

1. Run `npm test` to execute the jest test suite

## To Add

- [ ] Testing

## The MIT License

Copyright (c) 2018 Andrew Mead LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.