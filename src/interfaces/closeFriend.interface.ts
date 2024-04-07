import mongoose from "mongoose";

interface CloseFriend {
    _id: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    username: String,
    listCFAdded: mongoose.Schema.Types.ObjectId[],
    listCFAddedUsername: String[],
}

export default CloseFriend