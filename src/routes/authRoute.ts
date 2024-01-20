import { Router } from 'express'
import { register, deleteAllUser, getAllUser, login, logout, getAllToken, generateToken, deleteAllToken, getCurrentUser, getUsernameFromId } from '../controllers/auth.controller'

const authRouter: Router = Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.delete('/delete-all', deleteAllUser)
authRouter.get('/get-users', getAllUser)
authRouter.get('/get-username-from-id', getUsernameFromId)
authRouter.get('/get-tokens', getAllToken)
authRouter.get('/generate-token', generateToken)
authRouter.get('/get-current-user', getCurrentUser)
authRouter.delete('/logout', logout)
authRouter.delete('/delete-tokens', deleteAllToken)

export default authRouter