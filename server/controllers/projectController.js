import crypto from "crypto";

import Project from "../models/Project.js";
import User from "../models/User.js";


export const createProject = async (req, res) => {

    try {

        const {
            name,
            description
        } = req.body;


        if (!name || !description) {

            return res.status(400).json({
                message:
                    "Name and description are required"
            });
        }


        const project =
            await Project.create({
                name,
                description,
                owner: req.userId,
                members: [req.userId]
            });


        res.status(201).json({
            message:
                "Project created successfully",
            project
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Project creation failed",
            error: error.message
        });
    }
};



export const getProjects = async (req, res) => {

    try {

        const projects =
            await Project.find({
                members: req.userId
            });


        res.json({
            projects
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to fetch projects",
            error: error.message
        });
    }
};


export const getProjectById = async (
    req,
    res
) => {

    try {

        const {
            projectId
        } = req.params;


        const project =
            await Project.findById(projectId)
                .populate(
                    "owner",
                    "name email"
                )
                .populate(
                    "members",
                    "name email"
                );


        if (!project) {

            return res.status(404).json({
                message:
                    "Project not found"
            });
        }


        const isMember =
            project.members.some(
                (member) =>
                    member._id.toString() ===
                    req.userId
            );


        if (!isMember) {

            return res.status(403).json({
                message:
                    "You are not a member of this project"
            });
        }


        res.json({
            project
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to fetch project",
            error: error.message
        });
    }
};



export const addMember = async (
    req,
    res
) => {

    try {

        const {
            projectId
        } = req.params;

        const {
            email
        } = req.body;


        const user =
            await User.findOne({
                email
            });


        if (!user) {

            return res.status(404).json({
                message:
                    "User not found"
            });
        }


        const project =
            await Project.findById(
                projectId
            );


        if (!project) {

            return res.status(404).json({
                message:
                    "Project not found"
            });
        }


        if (
            project.owner.toString() !==
            req.userId
        ) {

            return res.status(403).json({
                message:
                    "Only project owner can add members"
            });
        }


        if (
            project.members.some(
                (memberId) =>
                    memberId.toString() ===
                    user._id.toString()
            )
        ) {

            return res.status(400).json({
                message:
                    "User is already a member"
            });
        }


        project.members.push(
            user._id
        );


        await project.save();


        res.json({
            message:
                "Member added successfully",
            project
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to add member",
            error: error.message
        });
    }
};



export const makeProjectPublic = async (
    req,
    res
) => {

    try {

        const {
            projectId
        } = req.params;


        const project =
            await Project.findById(
                projectId
            );


        if (!project) {

            return res.status(404).json({
                message:
                    "Project not found"
            });
        }


        if (
            project.owner.toString() !==
            req.userId
        ) {

            return res.status(403).json({
                message:
                    "Only project owner can make the project public"
            });
        }


        if (
            project.isPublic &&
            project.publicSlug
        ) {

            return res.json({
                message:
                    "Project is already public",
                publicSlug:
                    project.publicSlug
            });
        }


        const publicSlug =
            crypto
                .randomBytes(8)
                .toString("hex");


        project.isPublic = true;
        project.publicSlug = publicSlug;


        await project.save();


        res.json({
            message:
                "Project is now public",
            publicSlug
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to make project public",
            error: error.message
        });
    }
};



export const getPublicProject = async (
    req,
    res
) => {

    try {

        const {
            slug
        } = req.params;


        const project =
            await Project.findOne({
                publicSlug: slug,
                isPublic: true
            })
            .populate(
                "owner",
                "name email"
            )
            .populate(
                "members",
                "name email"
            );


        if (!project) {

            return res.status(404).json({
                message:
                    "Public project not found"
            });
        }


        res.json({
            project
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to fetch public project",
            error: error.message
        });
    }
};