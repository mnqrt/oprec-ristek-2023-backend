import { Request, Response } from 'express';
import UserModel from '../models/User'
import { Token } from '../models/Token'
import User from '../interfaces/user.interface';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

interface RequestBody {
    username: string;
    password: string;
}

interface Id {
    id: string,
    iat: any,
    exp: any
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string

const register = async (req: Request, res: Response) => {
    const { username, password }: RequestBody = req.body as RequestBody;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new UserModel({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json(newUser);
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
};

const login = async (req: Request, res: Response) => {
    const { username, password }: RequestBody = req.body as RequestBody;
    console.log("WOI ADA "+username)
    try {
        const user = await UserModel.findOne({ username: username })
        if (! user) return res.sendStatus(404)
        if (! (await bcrypt.compare(password, user.password))) return res.sendStatus(401)
        
        const accessToken = jwt.sign({ id: user._id }, ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
        const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET)

        res.cookie("ACCESS_TOKEN_USER", accessToken, {
            httpOnly: true,
            sameSite: 'strict',
        })
        res.cookie("REFRESH_TOKEN_USER", refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
        })

        const newToken = new Token({ userId: user._id, refreshToken })
        await newToken.save()

        res.status(200).json({ accessToken, refreshToken })
    }
    catch (error: unknown) {
        if (error instanceof Error) res.json({ message: error.message });
        else res.sendStatus(500);
    }
}

const generateToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies['REFRESH_TOKEN_USER']
    if(! refreshToken) return res.sendStatus(401)
    if(! (await Token.findOne({ refreshToken }))) return res.sendStatus(403)

    try {
        const idObject = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as Id 
        const user: User | null = await UserModel.findById(idObject.id)
        if (! user) return res.sendStatus(403)

        const accessToken = jwt.sign({ id: idObject }, ACCESS_TOKEN_SECRET, { expiresIn: '15m'})

        res.cookie("ACCESS_TOKEN_USER", accessToken, {
            httpOnly: true,
            sameSite: 'strict',
        })

        res.sendStatus(201)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const logout = async (req: Request, res: Response) => {
    await Token.findOneAndDelete({ refreshToken: req.cookies['REFRESH_TOKEN_USER'] })
    res.cookie("ACCESS_TOKEN_USER", "")
    res.cookie("REFRESH_TOKEN_USER", "")
    res.sendStatus(204)
}

const deleteAllToken = async (req: Request, res: Response) => {
    await Token.deleteMany({})
    res.cookie("ACCESS_TOKEN_USER", "")
    res.cookie("REFRESH_TOKEN_USER", "")
    res.sendStatus(204)
}

const getCurrentUser = async (req: Request, res: Response) => {
    const accessToken = req.cookies['ACCESS_TOKEN_USER']
    if(! accessToken) return res.sendStatus(401)
    
    try {
        const idObject = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as Id 
        const user: User | null = await UserModel.findById(idObject.id)
        if (! user) return res.sendStatus(403)

        res.status(200).json(user)
    }
    catch (error) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getUsernameFromId = async (req: Request, res: Response) => {
    const id = req.query.id
    const username = (await UserModel.findById(id))?.username
    res.json({ username })
}

const deleteAllUser = async (req: Request, res: Response) => {
    await UserModel.deleteMany({})
    res.sendStatus(204)
};

const getAllUser = async (req: Request, res: Response) => {
    console.log("HALO MASUKK")
    res.status(200).json(await UserModel.find({}))
}

const getAllToken = async (req: Request, res: Response) => {
    res.status(200).json(await Token.find({}))
}

export { register, deleteAllUser, getAllUser, login, logout, getAllToken, generateToken, deleteAllToken, getCurrentUser, getUsernameFromId }