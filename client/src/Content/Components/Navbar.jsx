"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getResume } from "../Redux/ActionCreartors/ResumeActionCreators";

/* ===========================
   NAVBAR (UNCHANGED)
=========================== */
export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showChat, setShowChat] = useState(false);
  const dispatch = useDispatch();
  const resume = useSelector((state) => state.ResumeStateData);

  useEffect(() => {
    dispatch(getResume());
  }, []);

  return (
    <>
      <header
        id="header"
        className={`header sticky-top mt-5 mx-4 navbar-light`}
        style={{
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
        }}
      >
        <nav
          className="navbar navbar-expand-lg container shadow px-3 py-3"
          style={{ borderRadius: "50px" }}
        >
          <button
            className="btn btn-sm btn-outline-secondary me-3 d-lg-none"
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              <i className="bi bi-moon"></i>
            ) : (
              <i className="bi bi-sun"></i>
            )}
          </button>

          <Link
            href="/"
            className="navbar-brand fw-bold fs-4 ms-lg-3"
            style={{ color: "var(--text-color)" }}
          >
            Portfolio
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <i
              className="bi bi-list"
              style={{ color: "var(--text-color)" }}
            ></i>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {[
                "Home",
                "About",
                "Skills",
                "Resume",
                "Certificate",
                "Portfolio",
                "Testimonials",
                "Services",
                "Blog",
                "Contact",
              ].map((item, index) => (
                <li className="nav-item" key={index}>
                  <a
                    href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
                    className="nav-link"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social Icons */}
            <div className="d-none d-lg-inline-block ms-4 fs-5">
              <a
                href={resume?.contact?.github || "#"}
                target="_blank"
                className="me-3"
              >
                <i className="bi bi-github"></i>
              </a>
              <a
                href={resume?.contact?.linkedin || "#"}
                target="_blank"
                className="me-3"
              >
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="https://www.instagram.com/_ishaan_12" target="_blank">
                <i className="bi bi-instagram"></i>
              </a>
            </div>

            <button
              className="btn btn-sm btn-outline-secondary ms-3 d-none d-lg-inline-block"
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <i className="bi bi-moon"></i>
              ) : (
                <i className="bi bi-sun"></i>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Floating Chat Button */}
      <button
        onClick={() => setShowChat(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "55px",
          height: "55px",
          borderRadius: "50%",
          backgroundColor: "gold",
          color: "black",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
          cursor: "pointer",
          zIndex: 1050,
        }}
      >
        <i className="bi bi-robot"></i>
      </button>

      {showChat && <ChatModal setShowChat={setShowChat} />}
    </>
  );
}

/* ===========================
   CHAT MODAL
=========================== */
const ChatModal = ({ setShowChat }) => (
  <div
    className="modal fade show"
    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}
  >
    <div
      className="modal-dialog modal-dialog-centered"
      style={{ maxWidth: "500px" }}
    >
      <div className="modal-content" style={{ borderRadius: "16px" }}>
        <div className="modal-header bg-primary text-white py-2">
          <h6 className="modal-title">
            <i className="bi bi-robot me-2"></i>Helping Assistant
          </h6>
          <button
            className="btn-close btn-close-white"
            onClick={() => setShowChat(false)}
          ></button>
        </div>
        <ChatbotUI />
      </div>
    </div>
  </div>
);

/* ===========================
   CHATBOT UI
=========================== */
const ChatbotUI = () => {
  const dispatch = useDispatch();
  const resume = useSelector((state) => state.ResumeStateData);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello! Ask anything about Ishaan — skills, projects, experience, services, certificates, or contact!",
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    dispatch(getResume());
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* ================================
       FIXED ABOUT QUERY (FULL DATA)
    ================================ */
  const getFullAbout = () => {
    let a = resume?.about;

    return `
👤 *About Ishaan*
${a?.summary}

⭐ *Skills:*
${a?.skills?.map((s) => "• " + s).join("\n")}

🎓 *Education:*
${a?.education?.map((e) => "• " + e).join("\n")}

💼 *Experience:*
${a?.experience?.map((e) => "• " + e).join("\n")}

💡 *Projects:*
${a?.projects?.map((p) => "• " + p).join("\n")}

📜 *Certificates:*
${a?.certificates?.map((c) => "• " + c).join("\n")}

🛠 *Services:*
${a?.services?.map((s) => "• " + s).join("\n")}
        `;
  };

  /* ================================
       BOT REPLY LOGIC
    ================================ */
  const botReply = (q) => {
    if (!resume) return "⏳ Loading...";
    const nq = q.toLowerCase().trim();

    /* ABOUT FIX */
    if (nq.includes("about")) return getFullAbout();

    /* SELECT SKILL */
    const skill = resume.skills?.find((s) => nq.includes(s.name.toLowerCase()));
    if (skill) {
      setActiveItem({ type: "skill", data: skill });
      return `🧠 *${skill.name}*\n${skill.description}\n⭐ Level: ${skill.level}%`;
    }

    /* FOLLOW UP: SKILL */
    if (activeItem?.type === "skill") {
      if (nq.includes("level")) return `⭐ Level: ${activeItem.data.level}%`;
      if (nq.includes("description")) return activeItem.data.description;
    }

    /* SELECT PROJECT */
    const project = resume.projects?.find((p) =>
      nq.includes(p.name.toLowerCase())
    );
    if (project) {
      setActiveItem({ type: "project", data: project });
      return `💡 *${project.name}*\n${project.shortDescription}\nAsk: technology, category, live, github`;
    }

    /* FOLLOW UP: PROJECT */
    if (activeItem?.type === "project") {
      const p = activeItem.data;
      if (nq.includes("tech")) return p.tech;
      if (nq.includes("category")) return p.category;
      if (nq.includes("live")) return p.liveUrl;
      if (nq.includes("github")) return p.githubRepo;
    }

    /* SELECT SERVICE */
    const service = resume.services?.find((s) =>
      nq.includes(s.name.toLowerCase())
    );
    if (service) {
      setActiveItem({ type: "service", data: service });
      return `🛠️ *${service.name}*\n${service.shortDescription}\nAsk: price, duration, technology, details`;
    }

    /* FOLLOW UP: SERVICE */
    if (activeItem?.type === "service") {
      const s = activeItem.data;
      if (nq.includes("price")) return `💰 Price: ₹${s.price}`;
      if (nq.includes("duration")) return `⏳ Duration: ${s.duration} days`;
      if (nq.includes("tech")) return s.technology;
      if (nq.includes("detail"))
        return s.longDescription.replace(/<\/?[^>]+>/g, "");
    }

    /* CATEGORY RESPONSES */
    if (nq.includes("skills"))
      return resume.skills.map((s) => `• ${s.name} (${s.level}%)`).join("\n");
    if (nq.includes("projects"))
      return resume.projects
        .map((p) => `💡 ${p.name} — ${p.shortDescription}`)
        .join("\n\n");
    if (nq.includes("services"))
      return resume.services
        .map((s) => `🛠️ ${s.name} — ${s.shortDescription}`)
        .join("\n\n");
    if (nq.includes("experience"))
      return resume.experience
        .map((e) => `💼 ${e.jobTitle} @ ${e.companyName}`)
        .join("\n");
    if (nq.includes("certificates"))
      return resume.certificates
        .map((c) => `📜 ${c.name} — ${c.issuedBy}`)
        .join("\n");

    return "🤖 I didn’t understand. Try asking about: skills, projects, services, experience...";
  };

  /* SEND MESSAGE */
  const sendMessage = (msg = null) => {
    const final = msg || input;
    if (!final.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: final }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const reply = botReply(final);
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      setTyping(false);
    }, 600);
  };

  return (
    <div
      className="modal-body d-flex flex-column p-0"
      style={{ minHeight: "480px" }}
    >
      {/* CHAT WINDOW */}
      <div
        className="flex-grow-1 p-3"
        style={{ overflowY: "auto", maxHeight: "380px" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`d-flex my-2 ${
              msg.sender === "user"
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <div
              style={{
                maxWidth: "75%",
                padding: "10px 14px",
                borderRadius: "14px",
                background: msg.sender === "user" ? "#0078ff" : "#fff",
                color: msg.sender === "user" ? "#fff" : "#333",
                boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                whiteSpace: "pre-line",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {typing && <div>🤖 Typing...</div>}
        <div ref={chatEndRef} />
      </div>

      {/* =====================================
       HORIZONTAL BUTTONS ABOVE INPUT (NEW)
    ====================================== */}
      <div
        style={{
          width: "100%",
          overflowX: "auto",
          whiteSpace: "nowrap",
          display: "flex",
          gap: "10px",
          padding: "10px",
          background: "#f8f9fa",
          borderTop: "1px solid #ddd",
        }}
      >
        {[
          "About",
          "Skills",
          "Projects",
          "Services",
          "Experience",
          "Certificates",
          "Contact",
        ].map((label, i) => (
          <button
            key={i}
            onClick={() => sendMessage(label.toLowerCase())}
            style={{
              padding: "8px 14px",
              background: "#ffffff",
              border: "1px solid #ccc",
              borderRadius: "20px",
              fontSize: "13px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* INPUT BAR */}
      <div className="p-2 border-top bg-white">
        <div className="input-group shadow-sm rounded-pill">
          <input
            type="text"
            className="form-control border-0 rounded-pill ps-3"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="btn btn-primary rounded-pill px-4"
            onClick={() => sendMessage()}
          >
            <i className="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
