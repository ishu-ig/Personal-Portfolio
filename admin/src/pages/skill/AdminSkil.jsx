import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net";
import {
  deleteSkill,
  getSkill,
} from "../../Redux/ActionCreartors/SkillActionCreators";

export default function AdminSkill() {
  const SkillStateData = useSelector((state) => state.SkillStateData);
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  // 🧾 Fetch Skill Data
  const getAPIData = () => {
    dispatch(getSkill());
    const timer = setTimeout(() => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
      $(tableRef.current).DataTable({
        responsive: true,
        autoWidth: false,
        pageLength: 8,
        language: {
          searchPlaceholder: "Search Skill records...",
          search: "",
        },
      });
    }, 400);
    return timer;
  };

  useEffect(() => {
    const timer = getAPIData();
    return () => clearTimeout(timer);
  }, [SkillStateData.length]);

  // 🗑 Delete Skill Record
  const deleteRecord = (_id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      dispatch(deleteSkill({ _id }));
      getAPIData();
    }
  };

  return (
    <div className="admin-skill-container p-3">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center bg-primary text-light rounded p-3 shadow-sm">
        <h5 className="mb-2 mb-md-0 fw-semibold text-light">
          <i className="fa fa-graduation-cap me-2"></i> Skill Management
        </h5>
        <Link
          to="/Skill/create"
          className="btn btn-light text-primary fw-semibold shadow-sm"
        >
          <i className="fa fa-plus me-1"></i> Add Skill
        </Link>
      </div>

      {/* Table Section */}
      <div className="border-0 mt-4">
        <div className="p-3">
          <div className="table-responsive">
            <table
              ref={tableRef}
              id="DataTable"
              className="table table-striped table-bordered align-middle responsive-table"
            >
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th className="text-center">Level</th>
                  <th>Status</th>
                  <th className="text-center">Edit</th>
                  <th className="text-center">Delete</th>
                </tr>
              </thead>

              <tbody>
                {SkillStateData && SkillStateData.length > 0 ? (
                  SkillStateData.map((item, i) => (
                    <tr key={item._id || i}>
                      <td data-label="ID" className="text-muted small">
                        {item._id}
                      </td>
                      <td
                        data-label="Skill Name"
                        className="fw-semibold text-primary"
                      >
                        {item.name}
                      </td>
                      
                      <td
                        data-label="Description"
                        className="text-justified text-muted small "
                      >
                        <div className="description mobile-description">
                          {item.description || "—"}
                        </div>
                      </td>
                      <td data-label="Level">{item.level}</td>
                      <td data-label="Status" className="text-center">
                        <span
                          className={`badge px-3 py-2 ${item.active ? "bg-success" : "bg-danger"
                            }`}
                        >
                          {item.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td data-label="Edit" className="text-center">
                        <Link
                          to={`/skill/update/${item._id}`}
                          className="btn btn-outline-primary btn-sm rounded-pill"
                          title="Edit"
                        >
                          <i className="fa fa-edit"></i>
                        </Link>
                      </td>
                      <td data-label="Delete" className="text-center">
                        <button
                          onClick={() => deleteRecord(item._id)}
                          className="btn btn-outline-danger btn-sm rounded-pill"
                          title="Delete"
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
                      records...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ✅ Styling */}
      <style>{`
        
      `}</style>
    </div>
  );
}
