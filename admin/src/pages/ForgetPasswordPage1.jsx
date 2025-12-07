import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function ForgetPasswordPage1() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Add fullscreen background class for login pages
    document.body.classList.add("login-active");
    return () => document.body.classList.remove("login-active");
  }, []);

  function getInputData(e) {
    setErrorMessage("");
    setUsername(e.target.value);
  }

  async function postData(e) {
    e.preventDefault();
    try {
      let response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/user/forgetPassword-1`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ username }),
        }
      );

      response = await response.json();

      if (response.result === "Done") {
        localStorage.setItem("reset-password-username", username);
        navigate("/forgetPassword-2");
      } else {
        setErrorMessage("User not found. Please check your email or username.");
      }
    } catch (error) {
      setErrorMessage("Internal Server Error");
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="login-title">Forgot Password</h2>

        <form onSubmit={postData} className="login-form">
          <div className="login-field">
            <input
              type="text"
              name="username"
              placeholder="Enter your Email or Username"
              value={username}
              onChange={getInputData}
              required
            />
          </div>

          {errorMessage && <div className="login-error">{errorMessage}</div>}

          <div className="login-btn mt-3">
            <div className="login-btn-layer"></div>
            <input type="submit" value="Send OTP" />
          </div>
        </form>

        <div className="mt-3 text-center">
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: "#2563eb",
              fontWeight: 500,
              transition: "color 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.color = "#1748cc")}
            onMouseOut={(e) => (e.target.style.color = "#2563eb")}
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
