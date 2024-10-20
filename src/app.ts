import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
import rootRouter from "./router/router";
import path from "path";
import { CenterType } from "./type/user";
import fs from "fs";

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
app.get('/media/:dir/:filename', (req, res) => {
    const filePath = path.join(__dirname, `../media/${req.params.dir}`, req.params.filename);

    // Check if file exists
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Get file extension for content type
        const fileExtension = path.extname(filePath).toLowerCase();
        let contentType;

        switch (fileExtension) {
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.pdf':
                contentType = 'application/pdf';
                break;
            default:
                contentType = 'application/octet-stream';
        }

        // Set the appropriate content type
        res.setHeader('Content-Type', contentType);
        // Send the file as a buffer
        res.send(data);
    });
});

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
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

export default app;
