import express from "express";
import {
    explainNote,
    generateDocs,
    generateReadme
} from "../controllers/geminiController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/explain", authMiddleware, explainNote);
router.post("/docs", authMiddleware, generateDocs);
router.post("/readme", authMiddleware, generateReadme);

export default router;