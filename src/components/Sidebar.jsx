import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Shirt,
  Sparkles,
  Bookmark,
  UserRound,
  LogOut
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { logout, user } = useAuth();

  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard
    },
    {
      name: "My Wardrobe",
      path: "/wardrobe",
      icon: Shirt
    },
    {
      name: "Recommendations",
      path: "/recommendations",
      icon: Sparkles
    },
    {
      name: "Saved Looks",
      path: "/saved",
      icon: Bookmark
    },
    {
      name: "Profile",
      path: "/profile",
      icon: UserRound
    }
  ];

  const handleLogout = () => {
    logout();

    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">

      <h2 className="logo">JustGo.</h2>

      <p className="menu-heading">MENU</p>

      <nav className="nav-menu">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <Icon size={20} />

              <span>{item.name}</span>

            </NavLink>
          );
        })}

      </nav>

      <div className="sidebar-footer">

        <p>{user?.name || "User"}</p>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;