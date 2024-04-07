import UserModel from "../models/User";
import PostModel from "../models/Post";
import User from "../interfaces/user.interface";
import Post from "../interfaces/post.interface";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { Request, Response } from "express";
import { ObjectId } from 'mongodb';
import { getCloseFriendById, twoUserIdAreEqual } from "./closeFriend.controller";

declare module 'express-serve-static-core' {
    interface Request {
        user: User
    }
}

interface InputPost {
    text: string,
    isCloseFriend: boolean
}

const getAllPost = async (req: Request, res: Response) => {
    const allPosts = await PostModel.find({})
    let allPostsFiltered = await Promise.all(allPosts.map(async (post) => {
        if (! post.isCloseFriend) return post

        //check if the current user (req.user) is included in the OP's (user who post the current post) Close Friend list 
        //OR    if the current user is the OP
        const postedUserId = post.postedUser
        const closeFriend = await getCloseFriendById(postedUserId)
        if (closeFriend?.listCFAdded.includes(req.user._id) || twoUserIdAreEqual(req.user._id, postedUserId)) return post
        return null
    }))
    allPostsFiltered = allPostsFiltered.filter(post => post !== null)
    res.json(allPostsFiltered)
}


const makePost = async (req: RequestWithUser, res: Response) => {
    const { text, isCloseFriend }: InputPost = req.body;
    try {
        const newPost = new PostModel({ text, postedUser: req.user, isCloseFriend })
        newPost.postedUsername = req.user.username
        await newPost.save()
        res.json(newPost)
    } catch (error) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const updateLike = async (req: RequestWithUser, res: Response) => {
    const { postId } = req.body
    try {
        const post = await PostModel.findById(postId)
        if (post == null)return res.sendStatus(404)
        

        if (post.likers.includes(req.user._id)) {
            post.likers = post.likers.filter(otherUser => otherUser != req.user._id)
            post.likersUsername = post.likersUsername.filter(otherUser => otherUser != req.user.username)
        }
        else {
            post.likers.push(req.user._id)
            post.likersUsername.push(req.user.username)
        }
        await post.save()

        res.sendStatus(201)
    } catch (error) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const updatePost = async (req: RequestWithUser, res: Response) => {
    const { text, postId } = req.body
    try {
        const post = await PostModel.findById(postId)
        if (post == null) return res.sendStatus(404)
        if (! (post.postedUser as unknown as ObjectId).equals(req.user._id as unknown as ObjectId)) return res.sendStatus(403)

        post.text = text
        await post.save()

        res.sendStatus(205)
    } catch (error) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const deletePost = async (req: RequestWithUser, res: Response) => {
    const { postId } = req.body
    try {
        const post = await PostModel.findById(postId)
        if (post == null)return res.sendStatus(404)
        if (! (post.postedUser as unknown as ObjectId).equals(req.user._id as unknown as ObjectId)) return res.sendStatus(403)

        await post.deleteOne()

        res.sendStatus(204)
    } catch (error) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}


const deleteAllPost = async (req: RequestWithUser, res: Response) => {
    await PostModel.deleteMany({})
    res.sendStatus(204)
}

export { getAllPost, makePost, deleteAllPost, updateLike, updatePost, deletePost }