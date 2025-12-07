import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net";

import {
  deleteNewsletter,
  getNewsletter,
  updateNewsletter,
} from "../../Redux/ActionCreartors/NewsletterActionCreators";

export default function AdminNewsletter() {
  const [flag, setFlag] = useState(false);
  const NewsletterStateData = useSelector((state) => state.NewsletterStateData);
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  // 🗑️ Delete Record
  const deleteRecord = (_id) => {
    if (window.confirm("Are you sure you want to delete this query?")) {
      dispatch(deleteNewsletter({ _id }));
      getAPIData();
    }
  };

  // 🔄 Toggle Query Status (Resolved/Pending)
  const updateRecord = (_id) => {
    if (window.confirm("Are you sure you want to update the status?")) {
      const item = NewsletterStateData.find((x) => x._id === _id);
      const index = NewsletterStateData.findIndex((x) => x._id === _id);
      dispatch(updateNewsletter({ ...item, active: !item.active }));
      NewsletterStateData[index].active = !item.active;
      setFlag(!flag);
    }
  };

  // 🧩 Fetch and Initialize DataTable
  const getAPIData = () => {
    dispatch(getNewsletter());
    const timer = setTimeout(() => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
      $(tableRef.current).DataTable({
        responsive: true,
        autoWidth: false,
        pageLength: 8,
        language: {
          searchPlaceholder: "Search contact queries...",
          search: "",
        },
      });
    }, 400);
    return timer;
  };

  console.log(NewsletterStateData)

  useEffect(() => {
    const timer = getAPIData();
    return () => clearTimeout(timer);
  }, [NewsletterStateData.length]);

  return (
    <>
      <style>{`
        /* Table Enhancements */
        #ContactTable td[data-label="Phone"],
        #ContactTable td[data-label="View"] {
          text-align: center !important;
          vertical-align: middle !important;
        }

        #ContactTable td[data-label="View"] .table-action-btn {
          display: inline-flex !important;
          justify-content: center !important;
          align-items: center !important;
          width: 100% !important;
          height: 40px !important;
          border-radius: 8px !important;
          font-size: 18px !important;
          background-color: #e9f2ff !important;
          transition: all 0.2s ease-in-out;
        }

        #ContactTable td[data-label="View"] .table-action-btn:hover {
          background-color: #d0e3ff !important;
          transform: scale(1.03);
        }

        @media (max-width: 768px) {
          #ContactTable {
            font-size: 14px !important;
          }
          #ContactTable td {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
          }
        }
      `}</style>

      <div className="admin-skill-container p-3">
        {/* 🔹 Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center bg-primary text-light rounded p-3 shadow-sm">
          <h5 className="mb-2 mb-md-0 fw-semibold text-light">
            <i className="fa fa-envelope me-2"></i> Contact Queries
          </h5>
        </div>

        {/* 🔹 Table Section */}
        <div className="table-responsive mt-4">
          <table
            ref={tableRef}
            id="ContactTable"
            className="table table-striped table-bordered align-middle shadow-sm responsive-table newsletter-table"
          >
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Status</th>
                <th className="text-center">Delete</th>
              </tr>
            </thead>

            <tbody>
              {NewsletterStateData && NewsletterStateData.length > 0 ? (
                NewsletterStateData.map((item, i) => (
                  <tr key={item._id || i}>
                    <td data-label="ID" className="text-muted small">
                      {item._id}
                    </td>
                    <td data-label="Email">{item.email}</td>
                    {/* Status Badge */}
                    <td
                      data-label="Status"
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

                    {/* 🗑️ Delete (only if pending) */}
                    <td data-label="Delete" className="text-center">
                      {!item.active ==false && (
                        <button
                          className="table-action-btn delete"
                          title="Delete Query"
                          onClick={() => deleteRecord(item._id)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">
                    <i className="fa fa-spinner fa-spin me-2"></i> Loading
                    queries...
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
