import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + file.originalname;

        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = [
        ".js",
        ".jsx",
        ".txt",
        ".md",
        ".pdf",
        ".png",
        ".jpg",
        ".jpeg"
    ];

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    if (allowedExtensions.includes(extension)) {
        cb(null, true);
    } else {
        cb(new Error("This file type is not allowed"));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

export default upload;