import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net";
import {
  deletePortfolio,
  getPortfolio,
} from "../../Redux/ActionCreartors/PortfolioActionCreators";

export default function AdminPortfolio() {
  const PortfolioStateData = useSelector((state) => state.PortfolioStateData);
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  // 🧾 Fetch data
  useEffect(() => {
    dispatch(getPortfolio());
  }, [dispatch]);

  // ⚙️ Initialize DataTable safely
  useEffect(() => {
    if (PortfolioStateData.length > 0 && tableRef.current) {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }

      const timer = setTimeout(() => {
        $(tableRef.current).DataTable({
          responsive: true,
          autoWidth: false,
          pageLength: 8,
          language: {
            searchPlaceholder: "Search portfolio...",
            search: "",
          },
          columnDefs: [
            { orderable: false, targets: [9, 10] },
            { targets: "_all", className: "align-middle" },
          ],
        });
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [PortfolioStateData]);

  // 🗑 Delete portfolio
  const deleteRecord = (_id) => {
    if (window.confirm("Are you sure you want to delete this portfolio?")) {
      dispatch(deletePortfolio({ _id }));
      setTimeout(() => dispatch(getPortfolio()), 400);
    }
  };

  return (
    <>
      <div className="admin-skill-container p-3">
        {/* 🔹 Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center bg-primary text-light rounded p-3 shadow-sm">
          <h5 className="mb-2 mb-md-0 fw-semibold text-light">
            <i className="fa fa-folder-open me-2"></i> Portfolio Management
          </h5>
          <Link
            to="/portfolio/create"
            className="btn btn-light text-primary fw-semibold shadow-sm"
          >
            <i className="fa fa-plus me-1"></i> Add Project
          </Link>
        </div>

        {/* 🔹 Table */}
        <div className="table-responsive mt-4">
          <table
            ref={tableRef}
            id="PortfolioTable"
            className="table table-striped table-bordered align-middle shadow-sm responsive-table newsletter-table"
          >
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Image</th>
                <th>Category</th>
                <th >Tech</th>
                <th >Short Description</th>
                <th>Live URL</th>
                <th>Github</th>
                <th>Status</th>
                <th >Edit</th>
                <th >Delete</th>
              </tr>
            </thead>
            <tbody>
              {PortfolioStateData.length > 0 ? (
                PortfolioStateData.map((item, i) => (
                  <tr key={item._id || i}>
                    <td data-label="ID" className="text-muted small">
                      {item._id}
                    </td>
                    <td data-label="Name" className="fw-semibold">
                      {item.name}
                    </td>
                    <td data-label="Image">
                      <Link
                        to={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                          alt={item.name}
                          className="rounded shadow-sm"
                        />
                      </Link>
                    </td>
                    <td data-label="Category">{item.category}</td>
                    <td data-label="Tech">
                      <div className="description">
                        {item.tech}
                      </div>
                    </td>
                    <td data-label="Short Description">
                      <div className="text-center">
                        {item.shortDescription || "—"}
                      </div>
                    </td>
                    <td data-label="Live URL">
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary text-decoration-underline"
                      >
                        {item.liveUrl ? "Live" : "—"}
                      </a>
                    </td>
                    <td data-label="Github">
                      <a
                        href={item.githubRepo}
                        target="_blank"
                        rel="noreferrer"
                        className="text-dark text-decoration-underline"
                      >
                        {item.githubRepo ? "Repo" : "—"}
                      </a>
                    </td>
                    <td data-label="Status">
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
                        to={`/portfolio/update/${item._id}`}
                        className="table-action-btn edit"
                        title="Edit Portfolio"
                      >
                        <i className="fa fa-edit"></i>
                      </Link>
                    </td>
                    <td data-label="Delete" className="text-center">
                      <button
                        className="table-action-btn delete"
                        title="Delete Portfolio"
                        onClick={() => deleteRecord(item._id)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-4 text-muted">
                    <i className="fa fa-spinner fa-spin me-2"></i> Loading
                    portfolio records...
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
