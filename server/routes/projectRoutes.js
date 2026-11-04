import express from "express";

import {
    createProject,
    getProjects,
    getProjectById,
    addMember,
    makeProjectPublic,
    getPublicProject
} from "../controllers/projectController.js";

import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();


router.get(
    "/public/:slug",
    getPublicProject
);



router.post(
    "/",
    authMiddleware,
    createProject
);



router.get(
    "/",
    authMiddleware,
    getProjects
);


router.get(
    "/:projectId",
    authMiddleware,
    getProjectById
);


router.post(
    "/:projectId/members",
    authMiddleware,
    addMember
);



router.post(
    "/:projectId/public",
    authMiddleware,
    makeProjectPublic
);


export default router;