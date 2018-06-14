import { server } from './server'

server.start({
    port: process.env.PORT || 3000
}, ({ port }) => {
    console.log(`Server is running on port ${port}`)
})