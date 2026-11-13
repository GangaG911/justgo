import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await login(formData);

      navigate("/", { replace: true });

    } catch (err) {
      setError(err.message);

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1 className="auth-logo">JustGo.</h1>

        <h2>Welcome Back!</h2>

        <p className="auth-subtitle">
          Login to discover your personal style.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Email Address</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

          {error && (
            <p className="auth-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">Create Account</Link>
        </p>

      </div>

    </div>
  );
}

export default Login;