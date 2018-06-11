import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const auth = {
    async signup(obj, args, ctx, info) {
        const password = await bcrypt.hash(args.password, 10)
        const user = await ctx.db.mutation.createUser({ data: { ...args, password } }, `{ id, name, email }`)

        return {
            token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET),
            user: user
        }
    },
    async login(obj, { email, password }, ctx) {
        const user = await ctx.db.query.user({ where: { email } })
        if (!user) {
            throw new Error('No user found')
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!user) {
            throw new Error('No user found')
        }

        return {
            token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET),
            user: user
        }
    }
}