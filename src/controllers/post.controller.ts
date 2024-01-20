import userModel from "../models/User";
import postModel from "../models/Post";
import User from "../interfaces/user.interface";
import Post from "../interfaces/post.interface";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { Request, Response } from "express";
import { ObjectId } from 'mongodb';

declare module 'express-serve-static-core' {
    interface Request {
        user: User
    }
}

interface InputPost {
    text: string
}

const getAllPost = async (req: Request, res: Response) => {
    // const allPosts = await postModel.find({})
    // console.log(JSON.stringify(allPosts))
    // const allPostsWithUsername = await Promise.all(allPosts.map(async post => {
    //     const user = await userModel.findById(post.postedUser);
    //     const { _id, text, dateAdded, likers } = post;
    //     const username = user?.username;
    //     return { _id, text, dateAdded, likers, username };
    // }))
    // console.log(allPostsWithUsername)
    // res.json(allPostsWithUsername);
    res.json(await postModel.find({}))
}

const makePost = async (req: RequestWithUser, res: Response) => {
    const { text }: InputPost = req.body;
    try {
        const newPost = new postModel({ text, postedUser: req.user })
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
        const post = await postModel.findById(postId)
        if (post == null)return res.sendStatus(404)
        

        if (post.likers.includes(req.user._id)) post.likers = post.likers.filter(otherUser => otherUser != req.user._id)
        else post.likers.push(req.user._id)
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
        const post = await postModel.findById(postId)
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
        const post = await postModel.findById(postId)
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
    await postModel.deleteMany({})
    res.sendStatus(204)
}

export { getAllPost, makePost, deleteAllPost, updateLike, updatePost, deletePost }