import cron from 'node-cron';
import express, {
    Application,
    NextFunction,
    Request,
    Response
} from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
import rootRouter from "./router/router";
import path from "path";
import { CenterType } from "./type/user";
import fs from "fs";
import generateDailyReport from "./modules/automate/classroom";
import helmet from 'helmet';

dotenv.config();

const app: Application = express();

// Automation

cron.schedule('0 */3 * * *', () => {
    generateDailyReport();
}, {
    scheduled: true
});
// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: ['http://localhost:3000', 'https://camiru.com', 'https://admin.socket.io'],
    credentials: true
}));

app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false
}));
app.use(cookieParser());

const mongoDB: string = process.env.MONGODB_URI || ""; // Use your MongoDB connection string

mongoose.connect(mongoDB);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', function () {
    console.log("Successfully connected to MongoDB!");
});



// app.use(express.static(path.join(__dirname, '../media')))

// Static media folder
app.get('/media/:dir/:filename', (req : Request, res : Response): void => {
    try {
        const filePath = path.join(__dirname, `../media/${req.params.dir}`, req.params.filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            const fallbackPath = path.join(__dirname, '../media', '404.png');
            const fallbackStream = fs.createReadStream(fallbackPath);

            // Set the fallback content type
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
            res.setHeader('Access-Control-Allow-Credentials', 'true');

            fallbackStream.pipe(res);
        }
        else {
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

            // Set the content type and stream the file
            res.setHeader('Content-Type', contentType);
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
            res.setHeader('Access-Control-Allow-Credentials', 'false');

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
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
            student?: any;
            staff?: any;
        }
    }
}
// Routes
app.use('/api', rootRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: err.toString()
    });
});

export default app;
