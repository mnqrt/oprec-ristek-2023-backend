import mongoose, { Mongoose } from 'mongoose'
import User from '../interfaces/user.interface'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const userModel = mongoose.model<User & mongoose.Document>('userModel', userSchema)

export default userModel