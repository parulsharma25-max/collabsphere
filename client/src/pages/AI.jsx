import { useState } from "react";
import {
    explainNote,
    generateDocs,
    generateReadme
} from "../services/api";

function AI() {
    const [content, setContent] =
        useState("");

    const [result, setResult] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const runAI = async (action) => {
        if (!content.trim()) {
            setError(
                "Please enter some content first."
            );
            return;
        }

        setLoading(true);
        setError("");
        setResult("");

        try {
            let data;

            if (action === "explain") {
                data =
                    await explainNote(content);

                setResult(
                    data.explanation
                );
            }

            if (action === "docs") {
                data =
                    await generateDocs(content);

                setResult(
                    data.documentation
                );
            }

            if (action === "readme") {
                data =
                    await generateReadme(
                        content
                    );

                setResult(data.readme);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-page">
            <div className="section-heading">
                <p className="eyebrow">
                    GEMINI POWERED
                </p>

                <h1>AI Tools 🤖</h1>

                <p>
                    Use Gemini to understand and
                    generate developer content.
                </p>
            </div>

            <div className="ai-layout">
                <div className="panel">
                    <h2>Input</h2>

                    {error && (
                        <div className="error-box">
                            {error}
                        </div>
                    )}

                    <textarea
                        className="large-textarea"
                        value={content}
                        onChange={(e) =>
                            setContent(
                                e.target.value
                            )
                        }
                        placeholder="Paste your code, note or project information..."
                    />

                    <div className="ai-buttons">
                        <button
                            className="primary-btn"
                            onClick={() =>
                                runAI("explain")
                            }
                            disabled={loading}
                        >
                            Explain
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() =>
                                runAI("docs")
                            }
                            disabled={loading}
                        >
                            Generate Docs
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() =>
                                runAI("readme")
                            }
                            disabled={loading}
                        >
                            Generate README
                        </button>
                    </div>
                </div>

                <div className="panel result-panel">
                    <h2>AI Result</h2>

                    {loading ? (
                        <div className="loading">
                            Gemini is thinking... 🤔
                        </div>
                    ) : result ? (
                        <pre>{result}</pre>
                    ) : (
                        <div className="empty">
                            Your AI response will
                            appear here.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AI;