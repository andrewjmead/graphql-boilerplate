import dotenv from 'dotenv'

const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
    dotenv.config({
        path: `./config/.${env}.env`
    })
}