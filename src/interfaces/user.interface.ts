import mongoose from "mongoose"

interface User {
    _id: mongoose.Schema.Types.ObjectId,
    username: string,
    password: string
};

export default User;