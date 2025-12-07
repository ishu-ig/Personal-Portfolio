import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar({ isExpanded }) {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: "fa-home", label: "Dashboard" },
    { path: "/skill", icon: "fa-lightbulb", label: "Skills" },
    { path: "/education", icon: "fa-graduation-cap", label: "Education" },
    { path: "/experience", icon: "fa-briefcase", label: "Experience" },
    { path: "/certificate", icon: "fa-certificate", label: "Certificates" },
    { path: "/portfolio", icon: "fa-image", label: "Portfolio" },
    { path: "/service", icon: "fa-concierge-bell", label: "Services" },
    { path: "/testimonial", icon: "fa-comments", label: "Testimonials" },
    { path: "/user", icon: "fa-users", label: "Users" },
    { path: "/contactus", icon: "fa-phone", label: "Contact Us" },
    { path: "/blog", icon: "fa-phone", label: "Blog" },
    { path: "/newsletter", icon: "fa-phone", label: "Newsletter" },
    { path: "/settings", icon: "fa-cog", label: "Settings" },
  ];

  return (
    <aside className={`admin-sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      {/* Header */}
      <div className="sidebar-header d-flex align-items-center justify-content-center flex-column py-4">
        <img
          src="https://i.pravatar.cc/100"
          alt="Admin"
          className="admin-avatar mb-2"
        />
        {isExpanded && <span className="admin-name">John Doe</span>}
      </div>

      {/* Menu */}
      <ul className="sidebar-menu list-unstyled">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`nav-link d-flex align-items-center ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <i className={`fa ${item.icon} me-2`}></i>
              {isExpanded && <span>{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
