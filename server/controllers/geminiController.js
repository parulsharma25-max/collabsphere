import { GoogleGenAI } from "@google/genai";

export const explainNote = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                message: "Note content is required"
            });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Explain this note in simple language:

${content}`
        });

        res.json({
            message: "Note explained successfully",
            explanation: response.text
        });

    } catch (error) {
        console.log("Gemini explain error:", error.message);

        res.status(500).json({
            message: "Gemini request failed",
            error: error.message
        });
    }
};

export const generateDocs = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                message: "Content is required"
            });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate clear documentation for the following content:

${content}`
        });

        res.json({
            message: "Documentation generated successfully",
            documentation: response.text
        });

    } catch (error) {
        console.log("Gemini docs error:", error.message);

        res.status(500).json({
            message: "Documentation generation failed",
            error: error.message
        });
    }
};

export const generateReadme = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                message: "Content is required"
            });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a professional README.md file for the following project.

Include:
- Project title
- Project description
- Features
- Technologies used
- How to install and run
- How to use

Project information:

${content}`
        });

        res.json({
            message: "README generated successfully",
            readme: response.text
        });

    } catch (error) {
        console.log("Gemini README error:", error.message);

        res.status(500).json({
            message: "README generation failed",
            error: error.message
        });
    }
};