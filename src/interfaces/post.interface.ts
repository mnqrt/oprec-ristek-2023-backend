import mongoose from 'mongoose'

interface Post {
    _id: mongoose.Schema.Types.ObjectId,
    postedUser: mongoose.Schema.Types.ObjectId,
    postedUsername: String,
    text: String,
    isCloseFriend: Boolean,
    dateAdded: Date,
    likers: mongoose.Schema.Types.ObjectId[],
    likersUsername: String[],
    replies: mongoose.Schema.Types.ObjectId[],
};

export default Post;