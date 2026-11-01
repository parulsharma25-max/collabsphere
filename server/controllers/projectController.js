import Project from "../models/Project.js";
import User from "../models/User.js";

export const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                message: "Name and description are required"
            });
        }

        const project = await Project.create({
            name,
            description,
            owner: req.userId,
            members: [req.userId]
        });

        res.status(201).json({
            message: "Project created successfully",
            project
        });
    } catch (error) {
        res.status(500).json({
            message: "Project creation failed",
            error: error.message
        });
    }
};

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            members: req.userId
        });

        res.json({
            projects
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch projects",
            error: error.message
        });
    }
};

export const addMember = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (project.owner.toString() !== req.userId) {
            return res.status(403).json({
                message: "Only project owner can add members"
            });
        }

        if (project.members.includes(user._id)) {
            return res.status(400).json({
                message: "User is already a member"
            });
        }

        project.members.push(user._id);

        await project.save();

        res.json({
            message: "Member added successfully",
            project
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add member",
            error: error.message
        });
    }
};