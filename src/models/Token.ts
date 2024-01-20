import mongoose from "mongoose"

const tokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    refreshToken: {
        type: String,
        required: true
    }
})

const Token = mongoose.model('token', tokenSchema)

export { Token }

//railway: deploy database sama backend