import { Router } from "express";
import { getAllPost, makePost, deleteAllPost, updateLike, updatePost, deletePost } from '../controllers/post.controller'
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { authenticateToken } from "../middleware/authMiddleware";

const postRouter = Router()

postRouter.use(authenticateToken)

postRouter.get('/get-all', getAllPost)
postRouter.post('/create-post', makePost)
postRouter.delete('/delete-post', deletePost)
postRouter.delete('/delete-all-posts', deleteAllPost)
postRouter.patch('/update-like', updateLike)
postRouter.patch('/update-post', updatePost)

export default postRouter