import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/User';
import User from '../interfaces/user.interface'
import RequestWithUser from '../interfaces/requestWithUser.interface';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

interface Id {
    id: string,
    iat: any,
    exp: any
}

export async function authenticateToken(req: RequestWithUser, res: Response, next: NextFunction){
    const authHeader: string | undefined = req.headers['authorization'];
    const token: string | undefined = authHeader?.split(' ')[1];
    if (token == undefined) {
        res.sendStatus(401);
        return;
    }

    try {
        const idObject = jwt.verify(token, (process.env as any).ACCESS_TOKEN_SECRET) as Id;

        const user: User | null = await UserModel.findById(idObject.id);
        if (! user) {
            res.sendStatus(403)
            return;
        }
        req.user = user
        next()
    }
    catch (error: unknown) {
        if (error instanceof Error) {
            res.status(503).json({ message: error.message });
            console.log(error.message)
        }
        else res.sendStatus(500);
    }
}
