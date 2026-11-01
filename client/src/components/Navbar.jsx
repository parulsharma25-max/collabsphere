import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (!token) {
        return (
            <nav className="navbar">
                <Link className="brand" to="/login">
                    CollabSphere
                </Link>

                <div className="nav-links">
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
            </nav>
        );
    }

    return (
        <nav className="navbar">
            <Link className="brand" to="/dashboard">
                CollabSphere
            </Link>

            <div className="nav-links">
                <Link
                    className={
                        location.pathname === "/dashboard"
                            ? "active"
                            : ""
                    }
                    to="/dashboard"
                >
                    Dashboard
                </Link>

                <Link
                    className={
                        location.pathname === "/projects"
                            ? "active"
                            : ""
                    }
                    to="/projects"
                >
                    Projects
                </Link>

                <Link
                    className={
                        location.pathname === "/notes"
                            ? "active"
                            : ""
                    }
                    to="/notes"
                >
                    Notes
                </Link>

                <Link
                    className={
                        location.pathname === "/ai"
                            ? "active"
                            : ""
                    }
                    to="/ai"
                >
                    AI Tools
                </Link>

                <Link
                    className={
                        location.pathname === "/files"
                            ? "active"
                            : ""
                    }
                    to="/files"
                >
                    Files
                </Link>

                <button className="logout-btn" onClick={logout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;