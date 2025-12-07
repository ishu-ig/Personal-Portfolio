import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net";
import {
  deleteBlog,
  getBlog,
} from "../../Redux/ActionCreartors/BlogActionCreators";

export default function AdminBlog() {
  const BlogStateData = useSelector((state) => state.BlogStateData);
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  // 🧾 Fetch data
  useEffect(() => {
    dispatch(getBlog());
  }, [dispatch]);

  // ⚙️ Initialize DataTable safely
  useEffect(() => {
    if (BlogStateData.length > 0 && tableRef.current) {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }

      const timer = setTimeout(() => {
        $(tableRef.current).DataTable({
          responsive: true,
          autoWidth: false,
          pageLength: 8,
          language: {
            searchPlaceholder: "Search blog...",
            search: "",
          },
          columnDefs: [
            { orderable: false, targets: [7, 8] },
            { targets: "_all", className: "align-middle" },
          ],
        });
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [BlogStateData]);

  // 🗑 Delete blog
  const deleteRecord = (_id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      dispatch(deleteBlog({ _id }));
      setTimeout(() => dispatch(getBlog()), 400);
    }
  };

  return (
    <>
      <div className="admin-skill-container p-3">
        {/* 🔹 Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center bg-primary text-light rounded p-3 shadow-sm">
          <h5 className="mb-2 mb-md-0 fw-semibold text-light">
            <i className="fa fa-newspaper me-2"></i> Blog Management
          </h5>
          <Link
            to="/blog/create"
            className="btn btn-light text-primary fw-semibold shadow-sm"
          >
            <i className="fa fa-plus me-1"></i> Add Blog
          </Link>
        </div>

        {/* 🔹 Table */}
        <div className="table-responsive mt-4">
          <table
            ref={tableRef}
            id="BlogTable"
            className="table table-striped table-bordered align-middle shadow-sm responsive-table"
          >
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Thumbnail</th>
                <th>Category</th>
                <th style={{ textAlign: "center" }}>Author</th>
                <th className="text-center">Short Description</th>
                <th>Date</th>
                <th className="text-center">Edit</th>
                <th className="text-center">Delete</th>
              </tr>
            </thead>

            <tbody>
              {BlogStateData.length > 0 ? (
                BlogStateData.map((item, i) => (
                  <tr key={item._id || i}>
                    <td data-label="ID" className="text-muted small">
                      {item._id}
                    </td>

                    <td data-label="Title" className="fw-semibold">
                      {item.title}
                    </td>

                    <td data-label="Thumbnail">
                      <Link
                        to={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                          alt={item.title}
                          className="rounded shadow-sm"
                        />
                      </Link>
                    </td>

                    <td data-label="Category">{item.category}</td>

                    <td data-label="Author" className="text-center">
                      {item.author}
                    </td>

                    <td data-label="Short Description">
                      <div className="description">
                        {item.shortDescription || "—"}
                      </div>
                    </td>

                    <td data-label="Date">{item.date}</td>

                    <td data-label="Edit" className="text-center">
                      <Link
                        to={`/blog/update/${item._id}`}
                        className="table-action-btn edit"
                        title="Edit Blog"
                      >
                        <i className="fa fa-edit"></i>
                      </Link>
                    </td>

                    <td data-label="Delete" className="text-center">
                      <button
                        className="table-action-btn delete"
                        title="Delete Blog"
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
                    <i className="fa fa-spinner fa-spin me-2"></i> Loading
                    blog records...
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
