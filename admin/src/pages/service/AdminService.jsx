import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net";
import {
  deleteService,
  getService,
} from "../../Redux/ActionCreartors/ServiceActionCreators";

export default function AdminService() {
  const ServiceStateData = useSelector((state) => state.ServiceStateData);
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  // 🔹 Fetch all services
  useEffect(() => {
    dispatch(getService());
  }, [dispatch]);

  // 🔹 Initialize DataTable with responsive configuration
  useEffect(() => {
    if (ServiceStateData.length > 0 && tableRef.current) {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }

      const timer = setTimeout(() => {
        $(tableRef.current).DataTable({
          responsive: true,
          autoWidth: false,
          pageLength: 8,
          language: {
            searchPlaceholder: "Search services...",
            search: "",
          },
          columnDefs: [{ orderable: false, targets: [9, 10] }],
        });
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [ServiceStateData]);

  // 🗑 Delete a service
  const deleteRecord = (_id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      dispatch(deleteService({ _id }));
      setTimeout(() => dispatch(getService()), 400);
    }
  };

  return (
    <>
      {/* 📱 Responsive styling for mobile view */}

      <div className="admin-skill-container p-3">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center bg-primary text-light rounded p-3 shadow-sm">
          <h5 className="mb-2 mb-md-0 fw-semibold text-light">
            <i className="fa fa-cogs me-2"></i> Service Management
          </h5>
          <Link
            to="/service/create"
            className="btn btn-light text-primary fw-semibold shadow-sm"
          >
            <i className="fa fa-plus me-1"></i> Add Service
          </Link>
        </div>

        {/* Table */}
        <div className="table-responsive mt-4">
          <table
            ref={tableRef}
            id="ServiceTable"
            className="table table-striped table-bordered align-middle shadow-sm responsive-table newsletter-table"
          >
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Icon</th>
                <th>Short Description</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Category</th>
                <th>Technology</th>
                <th>Status</th>
                <th className="text-center">Edit</th>
                <th className="text-center">Delete</th>
              </tr>
            </thead>

            <tbody>
              {ServiceStateData && ServiceStateData.length > 0 ? (
                ServiceStateData.map((item, i) => (
                  <tr key={item._id || i}>
                    <td data-label="ID" className="text-muted small">
                      {item._id}
                    </td>
                    <td data-label="Name" className="fw-semibold">
                      {item.name}
                    </td>
                    <td data-label="Icon">
                      <i className={`${item.icon} fs-4 text-primary`}></i>
                    </td>
                    <td data-label="Short Description" className="text-wrap">
                      {item.shortDescription || "—"}
                    </td>
                    <td
                      data-label="Price"
                      className="fw-semibold text-success text-nowrap"
                    >
                      ₹{item.price}
                    </td>
                    <td data-label="Duration">{item.duration} Weeks</td>
                    <td data-label="Category">{item.category}</td>
                    <td data-label="Technology">{item.technology}</td>
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
                        to={`/service/update/${item._id}`}
                        className="table-action-btn edit"
                        title="Edit Service"
                      >
                        <i className="fa fa-edit"></i>
                      </Link>
                    </td>
                    <td data-label="Delete" className="text-center">
                      <button
                        className="table-action-btn delete"
                        title="Delete Service"
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
                    services...
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
