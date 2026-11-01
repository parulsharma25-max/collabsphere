import { useState } from "react";
import {
    createNote,
    deleteNote,
    getNotes,
    updateNote
} from "../services/api";

function Notes() {
    const [projectId, setProjectId] = useState("");
    const [notes, setNotes] = useState([]);

    const [form, setForm] = useState({
        title: "",
        content: ""
    });

    const [editingId, setEditingId] =
        useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadNotes = async () => {
        if (!projectId) {
            setError("Please enter project ID");
            return;
        }

        try {
            const data =
    await getNotes(projectId);

setNotes(
    data.notes || data || []
);

setError("");

            setError("");
        } catch (error) {
            setError(error.message);
        }
    };

    const saveNote = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await updateNote(
                    editingId,
                    form
                );

                setMessage(
                    "Note updated successfully"
                );
            } else {
                await createNote({
                    ...form,
                    projectId
                });

                setMessage(
                    "Note created successfully"
                );
            }

            setForm({
                title: "",
                content: ""
            });

            setEditingId(null);

            loadNotes();
        } catch (error) {
            setError(error.message);
        }
    };

    const editNote = (note) => {
        setEditingId(note._id);

        setForm({
            title: note.title,
            content: note.content
        });
    };

    const removeNote = async (id) => {
        try {
            await deleteNote(id);
            loadNotes();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="content-page">
            <div className="section-heading">
                <p className="eyebrow">
                    KNOWLEDGE
                </p>

                <h1>Project Notes</h1>

                <p>
                    Create, edit and delete
                    project notes.
                </p>
            </div>

            <div className="panel project-selector">
                <label>Project ID</label>

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
                        className="primary-btn"
                        onClick={loadNotes}
                    >
                        Load Notes
                    </button>
                </div>
            </div>

            <div className="two-column">
                <div className="panel">
                    <h2>
                        {editingId
                            ? "Edit Note"
                            : "Create Note"}
                    </h2>

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

                    <form onSubmit={saveNote}>
                        <label>Title</label>

                        <input
                            value={form.title}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    title: e.target.value
                                })
                            }
                            placeholder="Note title"
                            required
                        />

                        <label>Content</label>

                        <textarea
                            value={form.content}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    content:
                                        e.target.value
                                })
                            }
                            placeholder="Write your note..."
                            rows="10"
                            required
                        />

                        <button className="primary-btn">
                            {editingId
                                ? "Update Note"
                                : "Create Note"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={() => {
                                    setEditingId(null);

                                    setForm({
                                        title: "",
                                        content: ""
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>

                <div className="panel">
                    <h2>Notes</h2>

                    {notes.length === 0 ? (
                        <div className="empty">
                            No notes loaded.
                        </div>
                    ) : (
                        <div className="note-list">
                            {notes.map((note) => (
                                <div
                                    className="note-card"
                                    key={note._id}
                                >
                                    <h3>
                                        {note.title}
                                    </h3>

                                    <p>
                                        {note.content}
                                    </p>

                                    <div className="card-actions">
                                        <button
                                            onClick={() =>
                                                editNote(
                                                    note
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                removeNote(
                                                    note._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Notes;
