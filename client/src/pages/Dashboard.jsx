import { Link } from "react-router-dom";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
        <div className="dashboard-page">

            <section className="hero">
                <div>
                    <p className="eyebrow">DEVELOPER COLLABORATION</p>

                    <h1>
                        Welcome, {user.name || "Developer"} 👋
                    </h1>

                    <p>
                        Manage projects, write notes, use Gemini AI and
                        share files from one simple workspace.
                    </p>

                    <div className="hero-actions">
                        <Link
                            className="primary-btn small"
                            to="/projects"
                        >
                            View Projects
                        </Link>

                        <Link
                            className="secondary-btn small"
                            to="/ai"
                        >
                            Try AI Tools
                        </Link>
                    </div>
                </div>

                <div className="hero-art">
                    <div className="code-card">
                        <span>const</span> team = <strong>"CollabSphere"</strong>;
                        <br />
                        team.<span>build</span>();
                        <br />
                        team.<span>collaborate</span>();
                    </div>
                </div>
            </section>

            <section className="stats-grid">

                <Link
                    to="/projects"
                    className="stat-card"
                >
                    <span>📁</span>
                    <h3>Projects</h3>
                    <p>
                        Create projects and manage your team members.
                    </p>
                </Link>

                <Link
                    to="/notes"
                    className="stat-card"
                >
                    <span>📝</span>
                    <h3>Notes</h3>
                    <p>
                        Create, edit and organize your project notes.
                    </p>
                </Link>

                <Link
                    to="/ai"
                    className="stat-card"
                >
                    <span>🤖</span>
                    <h3>Gemini AI</h3>
                    <p>
                        Explain content and generate documentation.
                    </p>
                </Link>

                <Link
                    to="/files"
                    className="stat-card"
                >
                    <span>📤</span>
                    <h3>Files</h3>
                    <p>
                        Upload single or multiple project files.
                    </p>
                </Link>

            </section>

        </div>
    );
}

export default Dashboard;