import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

import {
    uploadFile,
    uploadMultipleFiles,
    getProjectFiles,
    deleteFile
} from "../controllers/fileController.js";

const router = express.Router();


// Upload one file
router.post(
    "/upload",
    authMiddleware,
    upload.single("file"),
    uploadFile
);


// Upload multiple files
router.post(
    "/upload-multiple",
    authMiddleware,
    upload.array("files", 5),
    uploadMultipleFiles
);


// Get project files
router.get(
    "/:projectId",
    authMiddleware,
    getProjectFiles
);


// Delete file
router.delete(
    "/:fileId",
    authMiddleware,
    deleteFile
);


export default router;