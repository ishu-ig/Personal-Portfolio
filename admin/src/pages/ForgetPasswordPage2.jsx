import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function ForgetPasswordPage2() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Apply full-screen gradient background
    document.body.classList.add("login-active");
    return () => document.body.classList.remove("login-active");
  }, []);

  function getInputData(e) {
    setErrorMessage("");
    setOtp(e.target.value);
  }

  async function postData(e) {
    e.preventDefault();
    try {
      let response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/user/forgetPassword-2`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            username: localStorage.getItem("reset-password-username"),
            otp,
          }),
        }
      );

      response = await response.json();

      if (response.result === "Done") {
        navigate("/forgetPassword-3");
      } else {
        setErrorMessage(response.reason || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Internal Server Error");
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="login-title">Verify OTP</h2>

        <form onSubmit={postData} className="login-form">
          {/* OTP Field */}
          <div className="login-field">
            <input
              type="text"
              name="otp"
              onChange={getInputData}
              placeholder="Enter the OTP sent to your email"
              required
            />
          </div>

          {/* Error Message */}
          {errorMessage && <div className="login-error">{errorMessage}</div>}

          {/* Verify OTP Button */}
          <div className="login-btn mt-3">
            <div className="login-btn-layer"></div>
            <input type="submit" value="Verify OTP" />
          </div>
        </form>

        {/* Back to Login */}
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
