import mongoose from "mongoose";
import CloseFriend from "../interfaces/closeFriend.interface";

const closeFriendSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        unique: true,
        required: true
    },
    username: {
        type: String
    },
    listCFAdded: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    }],
    listCFAddedUsername: [{
        type: String
    }]
})

const CloseFriendModel = mongoose.model<CloseFriend & Document>('CloseFriendModel', closeFriendSchema)

export default CloseFriendModel