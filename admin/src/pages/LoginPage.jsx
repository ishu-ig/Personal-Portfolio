import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Apply login-specific background
    document.body.classList.add('login-active');
    return () => document.body.classList.remove('login-active');
  }, []);

  function getInputData(e) {
    const { name, value } = e.target;
    setErrorMessage('');
    setData((prev) => ({ ...prev, [name]: value }));
  }

  async function postData(e) {
    e.preventDefault();
    try {
      let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      response = await response.json();

      if (response.result === 'Done' && response.data.active === false) {
        setErrorMessage('Your account is not active. Please contact support.');
      } else if (response.result === 'Done') {
        if (response.data.role === 'Admin' || response.data.role === 'Super Admin') {
          localStorage.setItem('login', true);
          localStorage.setItem('name', response.data.name);
          localStorage.setItem('userid', response.data._id);
          localStorage.setItem('role', response.data.role);
          localStorage.setItem('token', response.token);

          if (
            !response.data.address ||
            !response.data.city ||
            !response.data.state ||
            !response.data.pin ||
            !response.data.phone
          ) {
            navigate('/profile');
          } else {
            navigate('/');
          }
        } else {
          setErrorMessage('Unauthorized access to this admin panel.');
        }
      } else {
        setErrorMessage('Invalid username/email or password.');
      }
    } catch (err) {
      setErrorMessage('Server error. Please try again later.');
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="login-title">Admin Login</h2>

        <form onSubmit={postData} className="login-form">
          {/* Username */}
          <div className="login-field">
            <input
              type="text"
              name="username"
              placeholder="Email or Username"
              required
              onChange={getInputData}
            />
          </div>

          {/* Password */}
          <div className="login-field">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              required
              onChange={getInputData}
            />
            <span className="login-eye" onClick={() => setShowPassword(!showPassword)}>
              <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </span>
          </div>

          {/* Error */}
          {errorMessage && <div className="login-error">{errorMessage}</div>}

          {/* Forgot Password */}
          <div className="login-pass-link">
            <Link to="/forgetPassword-1">Forgot Password?</Link>
          </div>

          {/* Submit */}
          <div className="login-btn">
            <div className="login-btn-layer"></div>
            <input type="submit" value="Login" />
          </div>
        </form>
      </div>
    </div>
  );
}
