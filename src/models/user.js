import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Define schema properties
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, {
    versionKey: false 
})

// Define middleware to has password before saving
UserSchema.pre('save', async function (next) {
    const user = this

    if (!user.isModified('password')) next()

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(user.password, salt)
    
    user.password = password
    next()
})

// Define method for generating an auth token
UserSchema.methods.generateAuthToken = function () {
    const user = this
    const token = jwt.sign({ _id: user._id, access: 'auth' }, 'mysecretauth').toString();
    return token
}

// Define middleware to find a user by their credentials
UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) throw new Error('Unable to find user')
    
    const match = await bcrypt.compare(password, user.password)
    
    if (match) {
        return user
    } else {
        throw new Error('Unable to find user')
    }
}

// Define middleware to find a user by an auth token
UserSchema.statics.findByToken = async (token) => {
    const decoded = jwt.verify(token, 'mysecretauth')
    const user = await User.findOne({ _id: decoded._id })
    
    if (user) {
        return user
    } else {
        throw new Error('Unable to find user')
    }
}

// Override toJSON to remove fields from responses
UserSchema.methods.clean = function () {
    const user = this;
    const objUser = user.toObject()
    delete objUser.password;
    return objUser;
}

const User = mongoose.model('User', UserSchema)

export { User as default }