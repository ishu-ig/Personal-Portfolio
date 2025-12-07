import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net";

import {
  deleteCertificate,
  getCertificate,
} from "../../Redux/ActionCreartors/CertificateActionCreators";

export default function AdminCertificate() {
  const CertificateStateData = useSelector(
    (state) => state.CertificateStateData
  );
  const dispatch = useDispatch();

  // 🗑 Delete Certificate
  const deleteRecord = (_id) => {
    if (window.confirm("Are you sure you want to delete this certificate?")) {
      dispatch(deleteCertificate({ _id }));
      getAPIData();
    }
  };

  // 📊 Initialize DataTable
  const getAPIData = () => {
    dispatch(getCertificate());
    const timer = setTimeout(() => {
      if ($.fn.DataTable.isDataTable("#CertificateTable")) {
        $("#CertificateTable").DataTable().destroy();
      }
      $("#CertificateTable").DataTable({
        responsive: true,
        autoWidth: false,
        language: {
          searchPlaceholder: "Search certificates...",
          search: "",
        },
        pageLength: 8,
      });
    }, 400);
    return timer;
  };

  useEffect(() => {
    const timer = getAPIData();
    return () => clearTimeout(timer);
  }, [CertificateStateData.length]);

  return (
    <div className="admin-skill-container p-3">
      {/* 🔹 Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center bg-primary text-light rounded p-3 shadow-sm">
        <h5 className="mb-2 mb-md-0 fw-semibold text-light">
          <i className="fa fa-certificate me-2"></i> Certificate Management
        </h5>
        <Link
          to="/certificate/create"
          className="btn btn-light text-primary fw-semibold shadow-sm"
        >
          <i className="fa fa-plus me-1"></i> Add Certificate
        </Link>
      </div>

      {/* 🔹 Table */}
      <div className="table-responsive mt-4">
        <table
          id="CertificateTable"
          className="table table-striped table-bordered align-middle shadow-sm responsive-table"
        >
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Image</th>
              <th>Issued By</th>
              <th>Status</th>
              <th className="text-center">Edit</th>
              <th className="text-center">Delete</th>
            </tr>
          </thead>

          <tbody>
            {CertificateStateData.length > 0 ? (
              CertificateStateData.map((item, i) => (
                <tr key={item._id || i}>
                  {/* ID */}
                  <td data-label="ID" className="text-muted small">
                    {item._id}
                  </td>

                  {/* Name */}
                  <td data-label="Name" className="fw-semibold">
                    {item.name}
                  </td>

                  {/* Image */}
                  <td data-label="Image">
                    {item.pic ? (
                      <Link
                        to={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                          alt={item.name}
                          className="rounded shadow-sm"
                          height={50}
                          width={80}
                          style={{ objectFit: "cover" }}
                        />
                      </Link>
                    ) : (
                      <span className="text-muted">No Image</span>
                    )}
                  </td>

                  {/* Issued By */}
                  <td data-label="Issued By">{item.issuedBy || "N/A"}</td>

                  {/* Status */}
                  <td data-label="Status">
                    <span
                      className={`badge px-3 py-2 ${
                        item.active ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {item.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Edit */}
                  <td data-label="Edit" className="text-center">
                    <Link
                      to={`/certificate/update/${item._id}`}
                      className="table-action-btn edit"
                      title="Edit Certificate"
                    >
                      <i className="fa fa-edit"></i>
                    </Link>
                  </td>

                  {/* Delete */}
                  <td data-label="Delete" className="text-center">
                    <button
                      className="table-action-btn delete"
                      title="Delete Certificate"
                      onClick={() => deleteRecord(item._id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  <i className="fa fa-spinner fa-spin me-2"></i> Loading
                  certificates...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
