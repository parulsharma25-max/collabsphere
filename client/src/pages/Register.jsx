import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
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
            await registerUser(form);
            navigate("/login");
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

                <h1>Create Account</h1>

                <p className="muted">
                    Start collaborating with your team
                </p>

                {error && (
                    <div className="error-box">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label>Name</label>

                    <input
                        name="name"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

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
                        placeholder="Create a password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <button
                        className="primary-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Register"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;