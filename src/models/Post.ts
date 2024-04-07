import mongoose from 'mongoose';
import Post from '../interfaces/post.interface';

const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now()
    },
    postedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postedUsername: {
        type: String,
    },
    isCloseFriend: {
        type: Boolean,
        required: true
    },
    likers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    }],
    likersUsername: [{
        type: String
    }],
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostModel'
    }]
})

const PostModel = mongoose.model<Post & mongoose.Document>('PostModel', postSchema)

export default PostModel