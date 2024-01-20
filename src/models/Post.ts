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
        required: true
    },
    likers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    }]
})

const postModel = mongoose.model<Post & mongoose.Document>('postModel', postSchema)

export default postModel