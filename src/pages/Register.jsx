import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
      await register(formData);

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

        <h2>Create Account</h2>

        <p className="auth-subtitle">
          Start your personal styling journey.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Full Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            minLength={2}
            maxLength={50}
            autoComplete="name"
            required
          />

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
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            autoComplete="new-password"
            required
          />

          {error && (
            <p className="auth-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Creating account..."
              : "Create Account"}
          </button>

        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </div>

    </div>
  );
}

export default Register;