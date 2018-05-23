import User from '../models/user'

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']

    if (!token) {
        return next()
    }

    try {
        req.user = await User.findByToken(token)
        next()
    } catch (e) {
        res.status(401).send()
    }
}

export { authMiddleware }