import mongoose from 'mongoose'

interface Post {
    _id: mongoose.Schema.Types.ObjectId,
    text: String,
    dateAdded: Date,
    postedUser: mongoose.Schema.Types.ObjectId,
    likers: mongoose.Schema.Types.ObjectId[]
};

export default Post;