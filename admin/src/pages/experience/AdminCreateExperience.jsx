import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import formValidator from '../../FormValidators/formValidator'
import { createExperience, getExperience } from "../../Redux/ActionCreartors/ExperienceActionCreators"

export default function AdminCreateExperience() {

    let [data, setData] = useState({
        jobTitle: "",
        companyName: "",
        startDate: "",
        endDate: "Current",
        description: "",
        active: true
    })

    let [error, setError] = useState({
        jobTitle: "Job Title is Mandatory",
        companyName: "Company Name is Mandatory",
        startDate: "Start Date is Mandatory",
        endDate: "",
        description: "Description is Mandatory",
    })

    let [show, setShow] = useState(false)
    let navigate = useNavigate()
    let ExperienceStateData = useSelector(state => state.ExperienceStateData)
    let dispatch = useDispatch()

    // ➤ Handle Input Changes
    function getInputData(e) {
        let name = e.target.name
        let value = e.target.value

        // Only validate non-dropdown fields
        if (name !== "active") {
            setError(old => ({
                ...old,
                [name]: formValidator(e)
            }))
        }

        setData(old => ({
            ...old,
            [name]: name === "active" ? value === "1" : value
        }))
    }

    // ➤ Submit Form
    function postSubmit(e) {
        e.preventDefault()

        let errorItem = Object.values(error).find(x => x !== "")
        if (errorItem) {
            setShow(true)
        } else {
            dispatch(createExperience({ ...data }))
            navigate("/experience")
        }
    }

    // ➤ Fetch experience on mount
    useEffect(() => {
        dispatch(getExperience())
    }, [ExperienceStateData.length])

    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">
                    Create Experience 
                    <Link to="/experience">
                        <i className="fa fa-arrow-left text-light float-end pt-1"></i>
                    </Link>
                </h5>

                {/* FORM CARD */}
                <div className="card mt-3 shadow-sm p-4">
                    <form onSubmit={postSubmit}>

                        {/* JOB TITLE */}
                        <div className="mb-3">
                            <label>Job Title *</label>
                            <input
                                type="text"
                                name="jobTitle"
                                onChange={getInputData}
                                placeholder="Job Title"
                                className={`form-control border-3 ${show && error.jobTitle ? "border-danger" : "border-primary"}`}
                            />
                            {show && error.jobTitle && <p className="text-danger">{error.jobTitle}</p>}
                        </div>

                        {/* COMPANY NAME */}
                        <div className="mb-3">
                            <label>Company Name *</label>
                            <input
                                type="text"
                                name="companyName"
                                onChange={getInputData}
                                placeholder="Company Name"
                                className={`form-control border-3 ${show && error.companyName ? "border-danger" : "border-primary"}`}
                            />
                            {show && error.companyName && <p className="text-danger">{error.companyName}</p>}
                        </div>

                        {/* DESCRIPTION */}
                        <div className="mb-3">
                            <label>Description *</label>
                            <textarea
                                name="description"
                                onChange={getInputData}
                                placeholder="Describe your role..."
                                rows={5}
                                className={`form-control border-3 ${show && error.description ? "border-danger" : "border-primary"}`}
                            ></textarea>
                            {show && error.description && <p className="text-danger">{error.description}</p>}
                        </div>

                        <div className="row">

                            {/* START DATE */}
                            <div className="col-md-6 mb-3">
                                <label>Start Date *</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    onChange={getInputData}
                                    className={`form-control border-3 ${show && error.startDate ? "border-danger" : "border-primary"}`}
                                />
                                {show && error.startDate && <p className="text-danger">{error.startDate}</p>}
                            </div>

                            {/* END DATE */}
                            <div className="col-md-6 mb-3">
                                <label>End Date *</label>
                                <input
                                    type="text"
                                    name="endDate"
                                    placeholder="Current or YYYY-MM-DD"
                                    onChange={getInputData}
                                    className={`form-control border-3 ${show && error.endDate ? "border-danger" : "border-primary"}`}
                                />
                                {show && error.endDate && <p className="text-danger">{error.endDate}</p>}
                            </div>
                        </div>

                        {/* ACTIVE STATUS */}
                        <div className="mb-3">
                            <label>Active *</label>
                            <select
                                name="active"
                                onChange={getInputData}
                                className="form-select border-3 border-primary"
                            >
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button type="submit" className="btn btn-primary w-100">
                            Create Experience
                        </button>

                    </form>
                </div>
            </div>
        </>
    )
}
