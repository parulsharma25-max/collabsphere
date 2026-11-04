import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import {
    createNote,
    deleteNote,
    getNotes,
    updateNote,
    explainNote
} from "../services/api";


function Notes() {

    const [searchParams] =
        useSearchParams();

    const projectIdFromUrl =
        searchParams.get("projectId");



    const [projectId, setProjectId] =
        useState(
            projectIdFromUrl || ""
        );

    const [notes, setNotes] =
        useState([]);

    const [form, setForm] = useState({
        title: "",
        content: ""
    });

    const [editingId, setEditingId] =
        useState(null);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [aiLoading, setAiLoading] =
        useState(false);

    const [aiResult, setAiResult] =
        useState("");

    const [aiTitle, setAiTitle] =
        useState("");

    const [previewMode, setPreviewMode] =
        useState(false);



    const loadNotes = async () => {

        if (!projectId) {

            setError(
                "Please enter project ID."
            );

            return;
        }

        try {

            setLoading(true);
            setError("");
            setMessage("");

            const data =
                await getNotes(
                    projectId
                );

            setNotes(
                data.notes ||
                data ||
                []
            );

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    };



    useEffect(() => {

        if (projectIdFromUrl) {

            setProjectId(
                projectIdFromUrl
            );

        }

    }, [projectIdFromUrl]);



    useEffect(() => {

        if (!projectIdFromUrl) {
            return;
        }

        const loadProjectNotes =
            async () => {

                try {

                    setLoading(true);
                    setError("");

                    const data =
                        await getNotes(
                            projectIdFromUrl
                        );

                    setNotes(
                        data.notes ||
                        data ||
                        []
                    );

                } catch (error) {

                    setError(
                        error.message
                    );

                } finally {

                    setLoading(false);
                }
            };

        loadProjectNotes();

    }, [projectIdFromUrl]);



    const saveNote = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        if (!projectId) {

            setError(
                "Project ID is required."
            );

            return;
        }

        try {

            if (editingId) {

                await updateNote(
                    editingId,
                    form
                );

                setMessage(
                    "Note updated successfully."
                );

            } else {

                await createNote({
                    ...form,
                    projectId
                });

                setMessage(
                    "Note created successfully."
                );
            }

            setForm({
                title: "",
                content: ""
            });

            setEditingId(null);

            setPreviewMode(false);

            await loadNotes();

        } catch (error) {

            setError(
                error.message
            );
        }
    };


    const editNote = (note) => {

        setEditingId(
            note._id
        );

        setForm({
            title:
                note.title || "",

            content:
                note.content || ""
        });

        setPreviewMode(false);

        setMessage("");
        setError("");
        setAiResult("");
    };



    const removeNote = async (
        noteId
    ) => {

        try {

            setMessage("");
            setError("");

            await deleteNote(
                noteId
            );

            setMessage(
                "Note deleted successfully."
            );

            await loadNotes();

        } catch (error) {

            setError(
                error.message
            );
        }
    };



    const cancelEdit = () => {

        setEditingId(null);

        setForm({
            title: "",
            content: ""
        });

        setPreviewMode(false);

        setMessage("");
        setError("");
    };


    const handleExplainNote = async (
        note
    ) => {

        try {

            setAiLoading(true);

            setAiResult("");

            setAiTitle(
                `Explanation: ${note.title}`
            );

            setError("");

            const data =
                await explainNote(
                    note.content
                );

            setAiResult(
                data.explanation ||
                data.message ||
                "No explanation received."
            );

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setAiLoading(false);
        }
    };


    const handleSuggestImprovements =
        async (note) => {

            try {

                setAiLoading(true);

                setAiResult("");

                setAiTitle(
                    `Suggested Improvements: ${note.title}`
                );

                setError("");

                const improvementPrompt = `
You are a helpful technical reviewer.

Review this project note and suggest
clear and practical improvements.

Please provide:

1. Missing points
2. Technical improvements
3. Clarity improvements
4. Better structure suggestions
5. Important corrections, if any

Do not rewrite the entire note.

Project Note:

${note.content}
                `;

                const data =
                    await explainNote(
                        improvementPrompt
                    );

                setAiResult(
                    data.explanation ||
                    data.message ||
                    "No suggestions received."
                );

            } catch (error) {

                setError(
                    error.message
                );

            } finally {

                setAiLoading(false);
            }
        };


    const closeAiResult = () => {

        setAiResult("");
        setAiTitle("");
    };



    return (
        <div className="content-page">



            <div className="section-heading">

                <p className="eyebrow">
                    KNOWLEDGE
                </p>

                <h1>
                    Project Notes
                </h1>

                <p>
                    Create, edit and manage
                    project notes using Markdown
                    and Gemini AI.
                </p>

            </div>

            <div className="panel project-selector">

                <label>
                    Project ID
                </label>

                <div className="inline-form">

                    <input
                        value={projectId}
                        onChange={(e) =>
                            setProjectId(
                                e.target.value
                            )
                        }
                        placeholder="Enter project ID"
                    />

                    <button
                        type="button"
                        className="primary-btn"
                        onClick={loadNotes}
                    >
                        Load Notes
                    </button>

                </div>

            </div>



            {message && (

                <div className="success-box">
                    {message}
                </div>

            )}

            {error && (

                <div className="error-box">
                    {error}
                </div>

            )}



            <div className="two-column">


                <div className="panel">

                    <h2>
                        {editingId
                            ? "Edit Note"
                            : "Create Note"}
                    </h2>


                    <div
                        className="inline-form"
                        style={{
                            marginBottom: "15px"
                        }}
                    >

                        <button
                            type="button"
                            className={
                                !previewMode
                                    ? "primary-btn"
                                    : "secondary-btn"
                            }
                            onClick={() =>
                                setPreviewMode(
                                    false
                                )
                            }
                        >
                            Write
                        </button>


                        <button
                            type="button"
                            className={
                                previewMode
                                    ? "primary-btn"
                                    : "secondary-btn"
                            }
                            onClick={() =>
                                setPreviewMode(
                                    true
                                )
                            }
                        >
                            Preview
                        </button>

                    </div>


                    {!previewMode ? (

                        <form
                            onSubmit={saveNote}
                        >

                            <label>
                                Title
                            </label>

                            <input
                                value={
                                    form.title
                                }
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        title:
                                            e.target.value
                                    })
                                }
                                placeholder="Note title"
                                required
                            />


                            <label>
                                Content
                            </label>

                            <textarea
                                value={
                                    form.content
                                }
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        content:
                                            e.target.value
                                    })
                                }
                                placeholder={
                                    "# My Note\n\nWrite Markdown here..."
                                }
                                rows="14"
                                required
                            />


                            <small>
                                You can use Markdown like
                                headings, bold text,
                                lists and code blocks.
                            </small>


                            <br />
                            <br />


                            <button
                                type="submit"
                                className="primary-btn"
                            >
                                {editingId
                                    ? "Update Note"
                                    : "Create Note"}
                            </button>


                            {editingId && (

                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={
                                        cancelEdit
                                    }
                                >
                                    Cancel
                                </button>

                            )}

                        </form>

                    ) : (

                        <div className="panel">

                            <h2>
                                {form.title ||
                                    "Untitled Note"}
                            </h2>

                            <ReactMarkdown>
                                {
                                    form.content ||
                                    "Nothing to preview."
                                }
                            </ReactMarkdown>

                        </div>

                    )}

                </div>


                <div className="panel">

                    <h2>
                        Notes ({notes.length})
                    </h2>


                    {loading ? (

                        <div className="empty">
                            Loading notes...
                        </div>

                    ) : notes.length === 0 ? (

                        <div className="empty">
                            No notes found.
                        </div>

                    ) : (

                        <div className="note-list">

                            {notes.map(
                                (note) => (

                                    <div
                                        className="note-card"
                                        key={
                                            note._id
                                        }
                                    >

                                        <h3>
                                            {note.title}
                                        </h3>


                                        <div
                                            style={{
                                                marginTop:
                                                    "10px"
                                            }}
                                        >

                                            <ReactMarkdown>
                                                {
                                                    note.content
                                                }
                                            </ReactMarkdown>

                                        </div>


                                        <div
                                            className="card-actions"
                                        >

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editNote(
                                                        note
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeNote(
                                                        note._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleExplainNote(
                                                        note
                                                    )
                                                }
                                                disabled={
                                                    aiLoading
                                                }
                                            >
                                                {aiLoading
                                                    ? "Working..."
                                                    : "🤖 Explain Note"}
                                            </button>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleSuggestImprovements(
                                                        note
                                                    )
                                                }
                                                disabled={
                                                    aiLoading
                                                }
                                            >
                                                {aiLoading
                                                    ? "Working..."
                                                    : "✨ Suggest Improvements"}
                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>



            {aiResult && (

                <div className="panel">

                    <div
                        style={{
                            display:
                                "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center"
                        }}
                    >

                        <h2>
                            {aiTitle}
                        </h2>

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={
                                closeAiResult
                            }
                        >
                            Close
                        </button>

                    </div>


                    <div
                        className="success-box"
                        style={{
                            marginTop: "15px"
                        }}
                    >

                        <pre
                            style={{
                                whiteSpace:
                                    "pre-wrap",
                                fontFamily:
                                    "inherit",
                                margin: 0
                            }}
                        >
                            {aiResult}
                        </pre>

                    </div>

                </div>

            )}

        </div>
    );
}


export default Notes;