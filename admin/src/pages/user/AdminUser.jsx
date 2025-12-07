import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net";

export default function AdminUser() {
  const [UserStateData, setUserStateData] = useState([]);
  const tableRef = useRef(null);

  // 🧾 Fetch all users
  async function getAPIData() {
    try {
      let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      });
      response = await response.json();
      setUserStateData(response.data || []);

      // Initialize DataTable
      setTimeout(() => {
        if ($.fn.DataTable.isDataTable(tableRef.current)) {
          $(tableRef.current).DataTable().destroy();
        }
        $(tableRef.current).DataTable({
          responsive: true,
          autoWidth: false,
          pageLength: 8,
          language: {
            searchPlaceholder: "Search users...",
            search: "",
          },
        });
      }, 300);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  }

  useEffect(() => {
    getAPIData();
  }, []);

  // 🗑 Delete user
  async function deleteRecord(_id) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/${_id}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      });
      getAPIData();
    }
  }

  // 🔄 Toggle active status
  async function updateRecord(_id) {
    if (window.confirm("Are you sure you want to update this user’s status?")) {
      const user = UserStateData.find((x) => x._id === _id);
      await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/${_id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ ...user, active: !user.active }),
      });
      getAPIData();
    }
  }

  return (
    <>
      {/* 📱 Scoped responsive styles */}

      <div className="admin-skill-container p-3">
        {/* 🔹 Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center bg-primary text-light rounded p-3 shadow-sm">
          <h5 className="mb-2 mb-md-0 fw-semibold text-light">
            <i className="fa fa-users me-2"></i> User Management
          </h5>
          <Link
            to="/user/create"
            className="btn btn-light text-primary fw-semibold shadow-sm"
          >
            <i className="fa fa-plus me-1"></i> Add User
          </Link>
        </div>

        {/* 🔹 Table */}
        <div className="table-responsive mt-4">
          <table
            ref={tableRef}
            id="UserTable"
            className="table table-striped table-bordered align-middle shadow-sm responsive-table"
          >
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-center">Edit</th>
                <th className="text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {UserStateData && UserStateData.length > 0 ? (
                UserStateData.map((item, i) => (
                  <tr key={item._id || i}>
                    <td data-label="ID" className="text-muted small">
                      {item._id}
                    </td>
                    <td data-label="Name" className="fw-semibold">
                      {item.name}
                    </td>
                    <td data-label="Username">{item.username}</td>
                    <td data-label="Email">{item.email}</td>
                    <td data-label="Phone">{item.phone}</td>
                    <td data-label="Role">
                      <span
                        className={`badge px-3 py-2 ${
                          item.role === "Super Admin"
                            ? "bg-warning text-dark"
                            : item.role === "Admin"
                            ? "bg-primary"
                            : "bg-secondary"
                        }`}
                      >
                        {item.role}
                      </span>
                    </td>
                    <td
                      data-label="Active"
                      onClick={() => updateRecord(item._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <span
                        className={`badge px-3 py-2 ${
                          item.active ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {item.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td data-label="Edit" className="text-center">
                      <Link
                        to={`/user/update/${item._id}`}
                        className="table-action-btn edit"
                        title="Edit User"
                      >
                        <i className="fa fa-edit"></i>
                      </Link>
                    </td>
                    <td data-label="Delete" className="text-center">
                      <button
                        className="table-action-btn delete"
                        title="Delete User"
                        onClick={() => deleteRecord(item._id)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">
                    <i className="fa fa-spinner fa-spin me-2"></i> Loading users...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
