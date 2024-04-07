import { Request, Response } from "express";
import mongoose from "mongoose";
import CloseFriendModel from "../models/CloseFriend";
import UserModel from "../models/User";
import { ObjectId } from "mongodb";

const updateCloseFriend = async(req: Request, res: Response) => {
    const { updatedUserId }: { updatedUserId: mongoose.Schema.Types.ObjectId } = req.body 
    try {
        const closeFriend = await getCloseFriendById(req.user._id)
        const updatedUser = await UserModel.findById(updatedUserId)
        const updatedUsername = updatedUser?.username as string

        if (! closeFriend) return null

        const userInCloseFriend = closeFriend?.listCFAdded.some(userId => twoUserIdAreEqual(userId, updatedUserId)) 
        
        if (userInCloseFriend) {
            closeFriend.listCFAdded = 
                closeFriend.listCFAdded.filter(userId => ! twoUserIdAreEqual(userId, updatedUserId))
            closeFriend.listCFAddedUsername = 
                closeFriend.listCFAddedUsername.filter(username => username !== updatedUsername)
        }
        else {
            closeFriend?.listCFAdded.push(updatedUserId)
            closeFriend?.listCFAddedUsername.push(updatedUsername)
        }

        closeFriend?.save()

        res.sendStatus(201)
    } catch (error) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getCloseFriendById = async(userId: mongoose.Schema.Types.ObjectId) => {
    //We first check if there exist such CloseFriendModel, if there isn't, we create a new one
    const checkCloseFriend = await CloseFriendModel.findOne({ userId })
    
    if (! checkCloseFriend) {
        const newCloseFriend = new CloseFriendModel({ userId })
        await newCloseFriend.save()
    }

    const closeFriend = await CloseFriendModel.findOne({ userId })

    return closeFriend
}

const getCloseFriend = async(req: Request, res: Response) => {
    const userId = req.user._id
    try {
        const closeFriend = await getCloseFriendById(userId)
        res.json(closeFriend)
    } catch (error) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const deleteAllCloseFriend = async(req: Request, res: Response) => {
    await CloseFriendModel.deleteMany({})
    res.sendStatus(204)
}

const twoUserIdAreEqual = (idOne: mongoose.Schema.Types.ObjectId, idTwo: mongoose.Schema.Types.ObjectId) => {
    return (idOne as unknown as ObjectId).equals(idTwo as unknown as ObjectId)
}

export { updateCloseFriend, getCloseFriendById, getCloseFriend, deleteAllCloseFriend, twoUserIdAreEqual }