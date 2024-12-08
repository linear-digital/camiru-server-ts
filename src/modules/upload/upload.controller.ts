import { NextFunction, Request, Response } from "express"
import fs from "fs"
import path from "path"
import sharp from "sharp"
import Upload from "./upload.model"
import { encrypt } from "../../util/security"
import ffmpeg from "fluent-ffmpeg"

const uploadProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if (!req.file) {
            return res.status(400).json();
        }
        const file = req.file;
        const resizedFileName = `${Date.now()}` + path.extname(file.originalname);
        // check is this file type supported
        await sharp(file.path)
            .resize({ width: 300 })
            .toFile(path.join("media/profile/", resizedFileName));

        // delete old file
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        const newFile = new Upload({
            file: { ...file, path: path.join("media/profile/", resizedFileName) },
            type: "profile"
        })

        const result = await newFile.save();

        res.status(200).json(encrypt(result));

    } catch (error: any) {
        next(error)
    }
}
const uploadDocuement = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if (!req.file) {
            return res.status(400).json();
        }
        const file = req.file;

        const newFile = new Upload({
            file: { ...file, path: path.join("media/document/", file.filename) },
            type: "profile"
        })

        const result = await newFile.save();

        res.status(200).json(encrypt(result));

    } catch (error: any) {
        next(error)
    }
}
const uploadMany = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if (!req.files) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const files: any = req.files;

        // Process files
        const result = await Promise.all(
            files.map(async (file: any) => {
                const supportedFormats = ['jpeg', 'png', 'webp', 'avif', 'gif'];
                const fileExt = path.extname(file.originalname).toLowerCase().replace('.', '');

                let processedFilePath = file.path; // Default path if no processing is done
                if (supportedFormats.includes(fileExt)) {
                    const resizedFileName = `${Date.now()}${path.extname(file.originalname)}`;
                    processedFilePath = path.join("media/document/", resizedFileName);

                    // Resize image
                    await sharp(file.path)
                        .resize({ width: 300 })
                        .toFile(processedFilePath);

                    // Delete the original file
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                }

                // Save file info to database
                const newFile = new Upload({
                    file: { ...file, path: processedFilePath },
                    type: "profile"
                });
                return await newFile.save();
            })
        );

        res.status(200).json(encrypt(result));
    } catch (error: any) {
        next(error);
    }
};

const getAllProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const page: any = req.query.page || 1
    const limit: any = req.query.limit || 20
    const skip = (page - 1) * limit
    try {
        const data = await Upload.find({ type: "profile" })
            .skip(skip)
            .limit(limit)
            .exec();
        const total = await Upload.countDocuments({ type: "profile" })
        res.send(encrypt({
            total,
            data
        }))
    } catch (error) {
        next(error)
    }
}

const deleteAllProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const allMedia = await Upload.find({ type: "profile" })
        await Promise.all(allMedia.map(async (media) => {
            const file = media.file.path
            if (fs.existsSync(file)) {
                fs.unlinkSync(file)
            }
            const respon = await Upload.findByIdAndDelete(media._id)
            return respon
        }))
        res.send(encrypt({
            message: "All media deleted",
            total: allMedia.length
        }))
    } catch (error) {
        next(error)
    }
}

const deleteSingle = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const image = await Upload.findByIdAndDelete(req.params.id)

        if (!image) {
            return res.status(404).send({ message: "Image not found" })
        }
        const file = image.file.path
        if (fs.existsSync(file)) {
            fs.unlinkSync(file)
        }
        await Upload.findByIdAndDelete(req.params.id)
        res.send(encrypt({
            message: "Image deleted",
        }))
    } catch (error) {
        next(error)
    }
}
const uplaodVideo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const inputPath = req.file?.path as string;
        const outputPath = `media/video/resized-${req.file?.originalname}`;
        const resizedPath = path.resolve(outputPath);

        // Create output directory if it doesn't exist
        const outputDir = path.dirname(resizedPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Resize video using FFmpeg
        ffmpeg(inputPath)
            .size("720x480") // Set resolution (e.g., 720p)
            .output(resizedPath)
            .on("end", () => {
                // Clean up the original uploaded file
                fs.unlinkSync(inputPath);
                res.status(200).json({ message: "Video resized successfully", resizedPath });
            })
            .on("error", (err) => {
                console.error("Error resizing video:", err);
                res.status(500).json({ error: "Failed to resize video" });
            })
            .run();

    } catch (error: any) {
        next(error)
    }
}
const uploadController = {
    uploadProfile,
    getAllProfile,
    deleteAllProfile,
    deleteSingle,
    uploadDocuement,
    uploadMany,
    uplaodVideo
}
export default uploadController