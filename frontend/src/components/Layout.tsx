import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="navbar">
        <span className="navbar-brand">Admin Panel</span>
        <div className="navbar-right">
          {user && <span className="navbar-user">{user.name}</span>}
          <button type="button" className="btn btn-ghost" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <div className="app-body">
        <nav className="sidebar">
          <NavLink to="/organizations" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
            Organizations
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
            Projects
          </NavLink>
        </nav>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
