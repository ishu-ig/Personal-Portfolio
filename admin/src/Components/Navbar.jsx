import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminNavbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top px-3" style={{ zIndex: 1030 }}>
      <div className="container-fluid">

        {/* Sidebar toggle for mobile */}
        <button
          className="btn btn-outline-light me-2 d-lg-none sidebar-toggle"
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars text-dark fs-5"></i>
        </button>

        <Link className="navbar-brand fw-bold text-primary d-flex align-items-center" to="/">
          <i className="fa fa-tachometer-alt me-2"></i> Dashboard
        </Link>

        {/* Desktop Menu */}
        <div className="d-none d-lg-flex ms-auto align-items-center">
          <Link className="nav-link mx-3 text-dark" to="/notifications">
            <i className="fas fa-bell me-1"></i> Notifications
          </Link>
          <Link className="nav-link mx-3 text-dark" to="/profile">
            <i className="fas fa-user-circle me-1"></i> Profile
          </Link>
          <button onClick={logout} className="btn btn-outline-danger rounded-pill px-3 py-1 mx-3">
            <i className="fas fa-sign-out-alt me-1"></i> Logout
          </button>
        </div>

        {/* Mobile Dropdown */}
        <div className="d-lg-none ms-auto position-relative" ref={menuRef}>
          <button
            className="btn btn-light rounded-circle shadow-sm p-2"
            type="button"
            onClick={() => setOpen(!open)}
          >
            <i className="fas fa-ellipsis-v text-dark"></i>
          </button>

          <ul
            className={`dropdown-menu dropdown-menu-end mt-2 shadow-sm border-0 ${open ? "show d-block" : ""}`}
            style={{ position: "absolute", right: 0 }}
          >
            <li>
              <Link className="dropdown-item py-2 d-flex align-items-center" to="/notifications" onClick={() => setOpen(false)}>
                <i className="fas fa-bell me-2 text-primary"></i> Notifications
              </Link>
            </li>
            <li>
              <Link className="dropdown-item py-2 d-flex align-items-center" to="/profile" onClick={() => setOpen(false)}>
                <i className="fas fa-user me-2 text-success"></i> Profile
              </Link>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item py-2 d-flex align-items-center text-danger" onClick={logout}>
                <i className="fas fa-sign-out-alt me-2"></i> Logout
              </button>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
}
