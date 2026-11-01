import File from "../models/File.js";
import Project from "../models/Project.js";


export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a file"
            });
        }

        const { projectId } = req.body;

        if (!projectId) {
            return res.status(400).json({
                message: "Project ID is required"
            });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (!project.members.includes(req.userId)) {
            return res.status(403).json({
                message: "You are not a member of this project"
            });
        }

        const file = await File.create({
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            project: projectId,
            uploadedBy: req.userId
        });

        res.status(201).json({
            message: "File uploaded successfully",
            file
        });

    } catch (error) {
        console.log("File upload error:", error.message);

        res.status(500).json({
            message: "File upload failed",
            error: error.message
        });
    }
};


export const uploadMultipleFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "Please upload at least one file"
            });
        }

        const { projectId } = req.body;

        if (!projectId) {
            return res.status(400).json({
                message: "Project ID is required"
            });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (!project.members.includes(req.userId)) {
            return res.status(403).json({
                message: "You are not a member of this project"
            });
        }

        const files = await File.insertMany(
            req.files.map((file) => ({
                fileName: file.originalname,
                filePath: file.path,
                fileType: file.mimetype,
                fileSize: file.size,
                project: projectId,
                uploadedBy: req.userId
            }))
        );

        res.status(201).json({
            message: "Files uploaded successfully",
            files
        });

    } catch (error) {
        console.log(
            "Multiple file upload error:",
            error.message
        );

        res.status(500).json({
            message: "Multiple file upload failed",
            error: error.message
        });
    }
};


export const getProjectFiles = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (!project.members.includes(req.userId)) {
            return res.status(403).json({
                message: "You are not a member of this project"
            });
        }

        const files = await File.find({
            project: projectId
        }).sort({
            createdAt: -1
        });

        res.json({
            files
        });

    } catch (error) {
        console.log(
            "Get files error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to load files",
            error: error.message
        });
    }
};



export const deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({
                message: "File not found"
            });
        }

        if (
            file.uploadedBy.toString() !==
            req.userId
        ) {
            return res.status(403).json({
                message:
                    "You can delete only your own files"
            });
        }

        await File.findByIdAndDelete(fileId);

        res.json({
            message: "File deleted successfully"
        });

    } catch (error) {
        console.log(
            "Delete file error:",
            error.message
        );

        res.status(500).json({
            message: "File deletion failed",
            error: error.message
        });
    }
};