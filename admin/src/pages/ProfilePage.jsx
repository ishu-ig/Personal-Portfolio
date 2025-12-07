import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProfilePage({ title }) {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        let response = await fetch(
          `${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        response = await response.json();
        if (response.data) setData(response.data);
        else navigate("/login");
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    })();
  }, [navigate]);

  if (!data)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="container my-5">
      <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: "650px", borderRadius: "12px" }}>
        <div className="card-body text-center p-4">
          {/* Profile Image */}
          <img
            src={data.pic ? `${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}` : "/img/noimage.jpg"}
            alt="Profile"
            className="rounded-circle shadow-sm mb-3"
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              border: "3px solid #dee2e6",
            }}
          />

          <h5 className="fw-bold text-dark mb-1">{data.name}</h5>
          <p className="text-muted small mb-1">{data.email}</p>
          <p className="text-muted small">{data.phone}</p>

          <hr />

          {/* Profile Details */}
          <div className="text-start mt-3 px-3">
            <table className="table table-borderless small">
              <tbody>
                <tr><th>Username:</th><td>{data.username}</td></tr>
                <tr><th>Address:</th><td>{data.address}</td></tr>
                <tr><th>City:</th><td>{data.city}</td></tr>
                <tr><th>State:</th><td>{data.state}</td></tr>
                <tr><th>Pin Code:</th><td>{data.pin}</td></tr>
                <tr><th>Role:</th><td>{data.role}</td></tr>
              </tbody>
            </table>
          </div>

          {/* Update Button */}
          <Link to="/update-profile" className="btn btn-primary text-light fw-semibold w-100 mt-3">
            <i className="fa fa-edit me-2"></i> Update Profile
          </Link>

          {/* Back to Dashboard */}
          <div className="mt-3">
            <Link to="/" className="text-decoration-none text-primary fw-semibold">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
