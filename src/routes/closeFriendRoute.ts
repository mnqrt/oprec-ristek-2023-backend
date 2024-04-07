import { Router } from "express";
import { updateCloseFriend, getCloseFriend, deleteAllCloseFriend } from "../controllers/closeFriend.controller";
import { authenticateToken } from "../middleware/authMiddleware";

const closeFriendRouter: Router = Router()

closeFriendRouter.use(authenticateToken)

closeFriendRouter.delete('/delete-all', deleteAllCloseFriend)
closeFriendRouter.patch('/update-close-friend', updateCloseFriend)
closeFriendRouter.get('/get-close-friend', getCloseFriend)

export default closeFriendRouter