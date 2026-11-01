import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await loginUser(form);

            localStorage.setItem("token", data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            navigate("/dashboard");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="logo-circle">C</div>

                <h1>Welcome Back</h1>

                <p className="muted">
                    Login to your CollabSphere account
                </p>

                {error && (
                    <div className="error-box">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label>Email</label>

                    <input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Password</label>

                    <input
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <button
                        className="primary-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/register">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;