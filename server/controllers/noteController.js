
import Note from "../models/Note.js";
import Project from "../models/Project.js";
import mongoose from "mongoose";



export const createNote = async (req, res) => {
    try {
        const { title, content, projectId } = req.body;

        console.log("CREATE NOTE DATA:", {
            title,
            content,
            projectId,
            userId: req.userId
        });

        // Check required fields
        if (!title || !content || !projectId) {
            return res.status(400).json({
                message: "Title, content and projectId are required"
            });
        }

        // Check Project ID
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                message: "Invalid Project ID. Please use the MongoDB Project ID."
            });
        }

        // Check user
        if (!req.userId) {
            return res.status(401).json({
                message: "User not authenticated"
            });
        }

        // Find project
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Debug project access
        console.log("LOGGED IN USER ID:", req.userId);
        console.log("PROJECT OWNER:", project.owner);
        console.log("PROJECT MEMBERS:", project.members);

        // Check member
        const isMember = Array.isArray(project.members)
            ? project.members.some(
                  (member) =>
                      member.toString() === req.userId.toString()
              )
            : false;

        // Check owner
        const isOwner =
            project.owner &&
            project.owner.toString() === req.userId.toString();

        console.log("IS MEMBER:", isMember);
        console.log("IS OWNER:", isOwner);

        if (!isMember && !isOwner) {
            return res.status(403).json({
                message: "You are not a member of this project"
            });
        }

        // Create note
        const note = await Note.create({
            title: title.trim(),
            content: content.trim(),
            project: new mongoose.Types.ObjectId(projectId),
            createdBy: new mongoose.Types.ObjectId(req.userId)
        });

        console.log("NOTE CREATED:", note._id);

        return res.status(201).json({
            message: "Note created successfully",
            note
        });

    } catch (error) {
        console.log("================================");
        console.log("CREATE NOTE ERROR");
        console.log(error);
        console.log("ERROR MESSAGE:", error.message);
        console.log("================================");

        return res.status(500).json({
            message: "Note creation failed",
            error: error.message
        });
    }
};



export const getNotes = async (req, res) => {
    try {
        const { projectId } = req.params;

        console.log("================================");
        console.log("GET NOTES PROJECT ID:", projectId);
        console.log("LOGGED IN USER ID:", req.userId);

        // Check Project ID
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                message: "Invalid Project ID"
            });
        }

        // Check user
        if (!req.userId) {
            return res.status(401).json({
                message: "User not authenticated"
            });
        }

        // Find project
        const project = await Project.findById(projectId);

        if (!project) {
            console.log("PROJECT NOT FOUND");

            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Debug project details
        console.log("PROJECT OWNER:", project.owner);
        console.log("PROJECT MEMBERS:", project.members);

        // Check member
        const isMember = Array.isArray(project.members)
            ? project.members.some(
                  (member) =>
                      member.toString() === req.userId.toString()
              )
            : false;

        // Check owner
        const isOwner =
            project.owner &&
            project.owner.toString() === req.userId.toString();

        console.log("IS MEMBER:", isMember);
        console.log("IS OWNER:", isOwner);

        // Check access
        if (!isMember && !isOwner) {
            console.log("ACCESS DENIED");

            return res.status(403).json({
                message: "You are not a member of this project"
            });
        }

        // Get notes
        const notes = await Note.find({
            project: new mongoose.Types.ObjectId(projectId)
        })
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        console.log("NOTES FOUND:", notes.length);
        console.log("================================");

        return res.json({
            notes
        });

    } catch (error) {
        console.log("================================");
        console.log("GET NOTES ERROR");
        console.log(error);
        console.log("ERROR MESSAGE:", error.message);
        console.log("================================");

        return res.status(500).json({
            message: "Failed to fetch notes",
            error: error.message
        });
    }
};


export const updateNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { title, content } = req.body;

        console.log("UPDATE NOTE:", {
            noteId,
            userId: req.userId
        });

        // Check Note ID
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return res.status(400).json({
                message: "Invalid Note ID"
            });
        }

        // Check user
        if (!req.userId) {
            return res.status(401).json({
                message: "User not authenticated"
            });
        }

        // Find note
        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        // Check note owner
        if (
            note.createdBy.toString() !==
            req.userId.toString()
        ) {
            return res.status(403).json({
                message: "You can only update your own note"
            });
        }

        // Check data
        if (!title && !content) {
            return res.status(400).json({
                message: "Title or content is required"
            });
        }

        // Update title
        if (title) {
            note.title = title.trim();
        }

        // Update content
        if (content) {
            note.content = content.trim();
        }

        await note.save();

        return res.json({
            message: "Note updated successfully",
            note
        });

    } catch (error) {
        console.log("================================");
        console.log("UPDATE NOTE ERROR");
        console.log(error);
        console.log("ERROR MESSAGE:", error.message);
        console.log("================================");

        return res.status(500).json({
            message: "Note update failed",
            error: error.message
        });
    }
};



export const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;

        console.log("DELETE NOTE:", {
            noteId,
            userId: req.userId
        });

        // Check Note ID
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return res.status(400).json({
                message: "Invalid Note ID"
            });
        }

        // Check user
        if (!req.userId) {
            return res.status(401).json({
                message: "User not authenticated"
            });
        }

        // Find note
        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        // Check note owner
        if (
            note.createdBy.toString() !==
            req.userId.toString()
        ) {
            return res.status(403).json({
                message: "You can only delete your own note"
            });
        }

        // Delete note
        await Note.findByIdAndDelete(noteId);

        return res.json({
            message: "Note deleted successfully"
        });

    } catch (error) {
        console.log("================================");
        console.log("DELETE NOTE ERROR");
        console.log(error);
        console.log("ERROR MESSAGE:", error.message);
        console.log("================================");

        return res.status(500).json({
            message: "Note deletion failed",
            error: error.message
        });
    }
};
