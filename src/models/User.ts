import mongoose from 'mongoose'
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

const UserModel = mongoose.model<User & mongoose.Document>('UserModel', userSchema)

export default UserModel