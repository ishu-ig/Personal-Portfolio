import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net";
import {
  deleteTestimonial,
  getTestimonial,
} from "../../Redux/ActionCreartors/TestimonialActionCreators";

export default function AdminTestimonial() {
  const TestimonialStateData = useSelector((state) => state.TestimonialStateData);
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  // ✅ Fetch testimonials
  useEffect(() => {
    dispatch(getTestimonial());
  }, [dispatch]);

  // ✅ Initialize DataTable safely
  useEffect(() => {
    if (TestimonialStateData.length > 0 && tableRef.current) {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }

      const timer = setTimeout(() => {
        $(tableRef.current).DataTable({
          responsive: true,
          autoWidth: false,
          pageLength: 8,
          language: {
            searchPlaceholder: "Search testimonials...",
            search: "",
          },
          columnDefs: [{ orderable: false, targets: [5, 6] }],
        });
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [TestimonialStateData]);

  // 🗑 Delete Testimonial
  const deleteRecord = (_id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      dispatch(deleteTestimonial({ _id }));
      setTimeout(() => dispatch(getTestimonial()), 400);
    }
  };

  return (
    <>
      {/* 📱 Mobile Responsive Adjustments */}
      <div className="admin-skill-container p-3">
        {/* 🔹 Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center bg-primary text-light rounded p-3 shadow-sm">
          <h5 className="mb-2 mb-md-0 fw-semibold text-light">
            <i className="fa fa-comment-dots me-2"></i> Testimonial Management
          </h5>
          <Link
            to="/testimonial/create"
            className="btn btn-light text-primary fw-semibold shadow-sm"
          >
            <i className="fa fa-plus me-1"></i> Add Testimonial
          </Link>
        </div>

        {/* 🔹 Table Section */}
        <div className="table-responsive mt-4">
          <table
            ref={tableRef}
            id="TestimonialTable"
            className="table table-striped table-bordered align-middle shadow-sm responsive-table"
          >
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Pic</th>
                <th>Status</th>
                <th>Message</th>
                <th className="text-center">Edit</th>
                <th className="text-center">Delete</th>
              </tr>
            </thead>

            <tbody>
              {TestimonialStateData && TestimonialStateData.length > 0 ? (
                TestimonialStateData.map((item, i) => (
                  <tr key={item._id || i}>
                    <td data-label="ID" className="text-muted small">
                      {item._id}
                    </td>
                    <td data-label="Name" className="fw-semibold">
                      {item.name}
                    </td>
                    <td data-label="Pic">
                      <Link
                        to={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                          alt={item.name}
                          className="rounded shadow-sm border"
                          style={{ width: "80px", height: "80px", objectFit: "cover" }}
                        />
                      </Link>
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
                    <td
                      data-label="Message"
                      className="text-wrap text-muted"
                      style={{ maxWidth: "300px", whiteSpace: "normal" }}
                    >
                      {item.message}
                    </td>
                    <td data-label="Edit" className="text-center">
                      <Link
                        to={`/testimonial/update/${item._id}`}
                        className="table-action-btn edit"
                        title="Edit Testimonial"
                      >
                        <i className="fa fa-edit"></i>
                      </Link>
                    </td>
                    <td data-label="Delete" className="text-center">
                      <button
                        className="table-action-btn delete"
                        title="Delete Testimonial"
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
                    <i className="fa fa-spinner fa-spin me-2"></i> Loading testimonials...
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
