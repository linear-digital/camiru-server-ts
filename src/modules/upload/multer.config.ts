import multer from "multer";
import path from "path";
import fs from "fs";

const profile = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const destination = path.join("media/profile/",);
            if (!fs.existsSync(destination)) {
                fs.mkdirSync(destination);
            }
            cb(null, destination);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        },
    }),
});

const multerConfig = {
    profile
}

export default multerConfig