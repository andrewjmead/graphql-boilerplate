import dotenv from 'dotenv'

const env = process.env.NODE_ENV || 'dev';

if (env === 'dev' || env === 'test') {
    dotenv.config({
        path: `./config/${env}.env`
    })
}