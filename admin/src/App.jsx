import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";

// 🧭 Layout Components
import AdminSidebar from "./Components/Sidebar";
import AdminNavbar from "./Components/Navbar";
import Footer from "./Components/Footer";

// 🔐 Auth Pages
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import ForgetPasswordPage1 from "./pages/ForgetPasswordPage1";
import ForgetPasswordPage2 from "./pages/ForgetPasswordPage2";
import ForgetPasswordPage3 from "./pages/ForgetPasswordPage3";

// 🧩 Skill Management
import AdminSkill from "./pages/skill/AdminSkil";
import AdminCreateSkill from "./pages/skill/AdminCreateSkill";
import AdminUpdateSkill from "./pages/skill/AdminUpdateSkill";

// // 🧩 Service Management
import AdminService from "./pages/service/AdminService";
import AdminCreateService from "./pages/service/AdminCreateService";
import AdminUpdateService from "./pages/service/AdminUpdateService";

// // 🧩 Experience Management
import AdminExperience from "./pages/experience/AdminExperience";
import AdminCreateExperience from "./pages/experience/AdminCreateExperience";
import AdminUpdateExperience from "./pages/experience/AdminUpdateExperience";

// // 🧩 Certificate Management
import AdminCertificate from "./pages/certificate/AdminCertificate";
import AdminCreateCertificate from "./pages/certificate/AdminCreateCertificate";
import AdminUpdateCertificate from "./pages/certificate/AdminUpdateCertificate";

// // 🧩 Portfolio Management
import AdminPortfolio from "./pages/portfolio/AdminPortfolio";
import AdminCreatePortfolio from "./pages/portfolio/AdminCreatePortfolio";
import AdminUpdatePortfolio from "./pages/portfolio/AdminUpdatePortfolio";

// 🧩 Education Management
import AdminEducation from "./pages/education/AdminEducation";
import AdminCreateEducation from "./pages/education/AdminCreateEducation";
import AdminUpdateEducation from "./pages/education/AdminUpdateEducation";

// // 🧩 Testimonial Management
import AdminTestimonial from "./pages/testimonial/AdminTestimonial";
import AdminCreateTestimonial from "./pages/testimonial/AdminCreateTestimonial";
import AdminUpdateTestimonial from "./pages/testimonial/AdminUpdateTestimonial";

// // 👥 User Management
import AdminUser from "./pages/user/AdminUser";
import AdminCreateUser from "./pages/user/AdminCreateUser";
import AdminUpdateUser from "./pages/user/AdminUpdateUser";

// // 📞 Contact Us Management
import AdminContactUs from "./pages/contactus/AdminContactUs";
import AdminContactUsShow from "./pages/contactus/AdminContactUsShow";

// // 👤 Profile Pages
import ProfilePage from "./pages/ProfilePage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import AdminBlog from "./pages/blog/AdminBlog";
import AdminCreateBlog from "./pages/blog/AdminCreateBlog";
import AdminUpdateBlog from "./pages/blog/AdminUpdateBlog";

import AdminNewsletter from "./pages/newsletter/AdminNewsletter"

// ======================
// 🌟 MAIN APP COMPONENT
// ======================
export default function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 992);

  // Check login status
  const checkLoginStatus = () => localStorage.getItem("login") === "true";

  useEffect(() => {
    const handleResize = () => setIsSidebarExpanded(window.innerWidth > 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <BrowserRouter>
      <MainContent
        isSidebarExpanded={isSidebarExpanded}
        toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
        checkLoginStatus={checkLoginStatus}
      />
    </BrowserRouter>
  );
}

// ======================
// 🌟 MAIN CONTENT WRAPPER
// ======================
function MainContent({ isSidebarExpanded, toggleSidebar, checkLoginStatus }) {
  const location = useLocation();
  const navigate = useNavigate();

  const publicRoutes = [
    "/login",
    "/forgetPassword-1",
    "/forgetPassword-2",
    "/forgetPassword-3",
  ];

  const isPublic = publicRoutes.includes(location.pathname);

  // Redirect if not logged in
  useEffect(() => {
    if (!checkLoginStatus() && !isPublic) navigate("/login");
  }, [location.pathname]);

  // Change background on login pages
  useEffect(() => {
    document.body.style.backgroundColor = isPublic ? "#f4f6f9" : "";
  }, [location.pathname]);

  return (
    <div className="app-wrapper">

      {/* ⭐ STICKY NAVBAR */}
      {!isPublic && (
        <AdminNavbar toggleSidebar={toggleSidebar} />
      )}

      {/* ⭐ SIDEBAR + CONTENT */}
      <div className="app-body">

        {/* Sidebar */}
        {!isPublic && (
          <div className={`sidebar-area ${isSidebarExpanded ? "open" : ""}`}>
            <AdminSidebar isExpanded={isSidebarExpanded} />
          </div>
        )}

        {/* Content */}
        <main className="content-area">
          <Routes>

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgetPassword-1" element={<ForgetPasswordPage1 />} />
            <Route path="/forgetPassword-2" element={<ForgetPasswordPage2 />} />
            <Route path="/forgetPassword-3" element={<ForgetPasswordPage3 />} />

            {/* Dashboard */}
            <Route path="/" element={<Home />} />

            {/* Skills */}
            <Route path="/skill" element={<AdminSkill />} />
            <Route path="/skill/create" element={<AdminCreateSkill />} />
            <Route path="/skill/update/:_id" element={<AdminUpdateSkill />} />

            {/* Education */}
            <Route path="/education" element={<AdminEducation />} />
            <Route path="/education/create" element={<AdminCreateEducation />} />
            <Route path="/education/update/:_id" element={<AdminUpdateEducation />} />

            {/* Experience */}
            <Route path="/experience" element={<AdminExperience />} />
            <Route path="/experience/create" element={<AdminCreateExperience />} />
            <Route path="/experience/update/:_id" element={<AdminUpdateExperience />} />

            {/* Certificate */}
            <Route path="/certificate" element={<AdminCertificate />} />
            <Route path="/certificate/create" element={<AdminCreateCertificate />} />
            <Route path="/certificate/update/:_id" element={<AdminUpdateCertificate />} />

            {/* Portfolio */}
            <Route path="/portfolio" element={<AdminPortfolio />} />
            <Route path="/portfolio/create" element={<AdminCreatePortfolio />} />
            <Route path="/portfolio/update/:_id" element={<AdminUpdatePortfolio />} />

            {/* Service */}
            <Route path="/service" element={<AdminService />} />
            <Route path="/service/create" element={<AdminCreateService />} />
            <Route path="/service/update/:_id" element={<AdminUpdateService />} />

            {/* Testimonial */}
            <Route path="/testimonial" element={<AdminTestimonial />} />
            <Route path="/testimonial/create" element={<AdminCreateTestimonial />} />
            <Route path="/testimonial/update/:_id" element={<AdminUpdateTestimonial />} />

            {/* User */}
            <Route path="/user" element={<AdminUser />} />
            <Route path="/user/create" element={<AdminCreateUser />} />
            <Route path="/user/update/:_id" element={<AdminUpdateUser />} />

            {/* Blog */}
            <Route path="/blog" element={<AdminBlog />} />
            <Route path="/blog/create" element={<AdminCreateBlog />} />
            <Route path="/blog/update/:_id" element={<AdminUpdateBlog />} />

            {/* Contact */}
            <Route path="/contactus" element={<AdminContactUs />} />
            <Route path="/contactus/view/:_id" element={<AdminContactUsShow />} />

            {/* Profile */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/update-profile" element={<UpdateProfilePage />} />

            {/* Newsletter */}
            <Route path="/newsletter" element={<AdminNewsletter />} />

          </Routes>

          {!isPublic && <Footer />}
        </main>
      </div>
    </div>
  );
}



