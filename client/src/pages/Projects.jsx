import { useEffect, useState } from "react";
import {
    createProject,
    getProjects
} from "../services/api";

function Projects() {
    const [projects, setProjects] = useState([]);

    const [form, setForm] = useState({
        name: "",
        description: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadProjects = async () => {
        try {
            const data = await getProjects();

            setProjects(
                data.projects || data || []
            );
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            await createProject(form);

            setForm({
                name: "",
                description: ""
            });

            setMessage(
                "Project created successfully"
            );

            loadProjects();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="content-page">
            <div className="section-heading">
                <p className="eyebrow">
                    WORKSPACE
                </p>

                <h1>Projects</h1>

                <p>
                    Create and manage your
                    collaboration projects.
                </p>
            </div>

            <div className="two-column">
                <div className="panel">
                    <h2>Create Project</h2>

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

                    <form onSubmit={handleSubmit}>
                        <label>
                            Project Name
                        </label>

                        <input
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value
                                })
                            }
                            placeholder="CollabSphere"
                            required
                        />

                        <label>
                            Description
                        </label>

                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description:
                                        e.target.value
                                })
                            }
                            placeholder="Describe your project"
                            rows="5"
                            required
                        />

                        <button className="primary-btn">
                            Create Project
                        </button>
                    </form>
                </div>

                <div className="panel">
                    <h2>Your Projects</h2>

                    {projects.length === 0 ? (
                        <div className="empty">
                            No projects found.
                        </div>
                    ) : (
                        <div className="project-list">
                            {projects.map(
                                (project) => (
                                    <div
                                        className="project-card"
                                        key={project._id}
                                    >
                                        <div className="project-icon">
                                            📁
                                        </div>

                                        <div>
                                            <h3>
                                                {project.name}
                                            </h3>

                                            <p>
                                                {
                                                    project.description
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Projects;