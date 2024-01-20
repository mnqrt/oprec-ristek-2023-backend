import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose';
import cors from 'cors'
import authRouter from './routes/authRoute'
import postRouter from './routes/postRoute';

const app = express()
dotenv.config()

const MONGO_URL: string = process.env.DATABASE_URL || "mongodb://localhost"
mongoose.connect(MONGO_URL)
const db = mongoose.connection
db.once("open", (): void => console.log("Connected to Mongoose"))

app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))
app.use(express.json())
app.use('/auth', authRouter)
app.use('/post', postRouter)

app.listen(4000)