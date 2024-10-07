import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
import rootRouter from "./router/router";
import path from "path";
import { CenterType } from "./type/user";


dotenv.config();

const app: Application = express();

// Middleware
app.use(bodyParser.json());
app.use(cors(
    {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }
));
app.use(cookieParser());

const mongoDB: string = process.env.MONGODB_URI || ""; // Use your MongoDB connection string

mongoose.connect(mongoDB);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', function () {
    console.log("Successfully connected to MongoDB!");
});

// Static media folder
app.use('/media',
    express.static(path.join(__dirname, 'media')));


// 
app.get('/', (_req: Request, res: Response, next: NextFunction) => {
    try {
        res.send('Hello, World!');
    } catch (error) {
        next(error)
    }
})
declare global {
    namespace Express {
        interface Request {
            center?: CenterType;
        }
    }
}
// Routes
app.use('/api', rootRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

export default app;
