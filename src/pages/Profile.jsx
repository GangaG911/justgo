
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Profile() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load profile");
        }

        setProfile(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="page-container">
      <h1>My Profile 👤</h1>
      <p>Manage your personal style account.</p>

      <div className="page-card">
        <UserRound size={40} color="#c5a96d" />
        <h2>Welcome to JustGo</h2>

        {loading ? (
          <p>Loading profile...</p>
        ) : error ? (
          <p className="auth-error">{error}</p>
        ) : (
          <div className="profile-details">
            <div className="profile-detail">
              <p>FULL NAME</p>
              <h3>{profile?.name}</h3>
            </div>

            <div className="profile-detail">
              <p>EMAIL ADDRESS</p>
              <h3>{profile?.email}</h3>
            </div>

            <button
              className="profile-logout"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
