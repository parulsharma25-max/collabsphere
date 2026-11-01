import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import geminiRoutes from "./routes/geminiRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

import authMiddleware from "./middleware/authMiddleware.js";

console.log(
    "Gemini API Key loaded:",
    !!process.env.GEMINI_API_KEY
);

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/files", fileRoutes);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.json({
        message: "CollabSphere Backend is running"
    });
});

app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You can access this protected route",
        userId: req.userId
    });
});

app.use((error, req, res, next) => {
    console.log("Upload error:", error.message);

    if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            message: "File size must be less than 5 MB"
        });
    }

    if (error.message === "This file type is not allowed") {
        return res.status(400).json({
            message: "This file type is not allowed"
        });
    }

    res.status(500).json({
        message: "Something went wrong",
        error: error.message
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
