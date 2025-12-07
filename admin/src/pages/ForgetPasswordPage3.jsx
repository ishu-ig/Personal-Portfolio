import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ password: "", cpassword: "" });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Add fullscreen background class
    document.body.classList.add("login-active");
    return () => document.body.classList.remove("login-active");
  }, []);

  function getInputData(e) {
    const { name, value } = e.target;
    setErrorMessage("");
    setData((prev) => ({ ...prev, [name]: value }));
  }

  async function postData(e) {
    e.preventDefault();

    if (data.password === data.cpassword) {
      try {
        let response = await fetch(
          `${process.env.REACT_APP_BACKEND_SERVER}/api/user/forgetPassword-3`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              username: localStorage.getItem("reset-password-username"),
              password: data.password,
            }),
          }
        );

        response = await response.json();

        if (response.result === "Done") {
          localStorage.removeItem("reset-password-username");
          navigate("/login");
        } else {
          setErrorMessage(response.reason || "Something went wrong");
        }
      } catch (error) {
        setErrorMessage("Internal Server Error");
      }
    } else {
      setErrorMessage("Password and Confirm Password do not match.");
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="login-title">Reset Password</h2>

        <form onSubmit={postData} className="login-form">
          {/* Password */}
          <div className="login-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={getInputData}
              placeholder="New Password"
              required
            />
            <span
              className="login-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i
                className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </span>
          </div>

          {/* Confirm Password */}
          <div className="login-field">
            <input
              type={showPassword ? "text" : "password"}
              name="cpassword"
              onChange={getInputData}
              placeholder="Confirm Password"
              required
            />
            <span
              className="login-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i
                className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </span>
          </div>

          {/* Error Message */}
          {errorMessage && <div className="login-error">{errorMessage}</div>}

          {/* Submit */}
          <div className="login-btn mt-3">
            <div className="login-btn-layer"></div>
            <input type="submit" value="Reset Password" />
          </div>
        </form>
      </div>
    </div>
  );
}
