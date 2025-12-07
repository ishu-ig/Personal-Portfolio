import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'

import formValidator from '../../FormValidators/formValidator'
import { getExperience, updateExperience } from "../../Redux/ActionCreartors/ExperienceActionCreators"

export default function AdminUpdateExperience() {

    let { _id } = useParams()

    let [data, setData] = useState({
        jobTitle: "",
        companyName: "",
        startDate: "",
        endDate: "",
        description: "",
        active: true
    })

    let [error, setError] = useState({
        jobTitle: "",
        companyName: "",
        startDate: "",
        endDate: "",
        description: "",
    })

    let [show, setShow] = useState(false)

    let navigate = useNavigate()
    let ExperienceStateData = useSelector(state => state.ExperienceStateData)
    let dispatch = useDispatch()

    // ➤ On Input Change
    function getInputData(e) {
        let name = e.target.name
        let value = e.target.value

        if (name !== "active") {
            setError(old => ({
                ...old,
                [name]: formValidator(e)
            }))
        }

        setData(old => ({
            ...old,
            [name]: name === "active" ? (value === "1" ? true : false) : value
        }))
    }

    // ➤ Submit
    function postSubmit(e) {
        e.preventDefault()

        // Validate
        let errorItem = Object.values(error).find(x => x !== "")
        if (errorItem) {
            setShow(true)
            return
        }

        // DUPLICATE CHECK (jobTitle + companyName combination)
        let item = ExperienceStateData.find(
            x =>
                x._id !== _id &&
                x.jobTitle.toLowerCase() === data.jobTitle.toLowerCase() &&
                x.companyName.toLowerCase() === data.companyName.toLowerCase()
        )

        if (item) {
            setShow(true)
            setError(old => ({
                ...old,
                jobTitle: "This experience record already exists",
            }))
            return
        }

        // Update record
        dispatch(updateExperience({ ...data }))
        navigate("/experience")
    }

    // ➤ Load Current Experience Data
    useEffect(() => {
        dispatch(getExperience())

        if (ExperienceStateData.length) {
            let item = ExperienceStateData.find(x => x._id === _id)
            if (item) {
                setData({ ...item })
            }
        }
    }, [ExperienceStateData.length])

    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">
                    Update Experience
                    <Link to="/experience">
                        <i className="fa fa-arrow-left text-light float-end pt-1"></i>
                    </Link>
                </h5>

                {/* Form */}
                <div className="card mt-3 shadow-sm p-4">
                    <form onSubmit={postSubmit}>

                        {/* Job Title */}
                        <div className="mb-3">
                            <label>Job Title *</label>
                            <input
                                type="text"
                                name="jobTitle"
                                value={data.jobTitle}
                                onChange={getInputData}
                                placeholder="Job Title"
                                className={`form-control border-3 ${show && error.jobTitle ? "border-danger" : "border-primary"}`}
                            />
                            {show && error.jobTitle && <p className="text-danger">{error.jobTitle}</p>}
                        </div>

                        {/* Company Name */}
                        <div className="mb-3">
                            <label>Company Name *</label>
                            <input
                                type="text"
                                name="companyName"
                                value={data.companyName}
                                onChange={getInputData}
                                placeholder="Company Name"
                                className={`form-control border-3 ${show && error.companyName ? "border-danger" : "border-primary"}`}
                            />
                            {show && error.companyName && <p className="text-danger">{error.companyName}</p>}
                        </div>

                        {/* Description */}
                        <div className="mb-3">
                            <label>Description *</label>
                            <textarea
                                name="description"
                                value={data.description}
                                onChange={getInputData}
                                placeholder="Describe your role..."
                                rows={5}
                                className={`form-control border-3 ${show && error.description ? "border-danger" : "border-primary"}`}
                            ></textarea>
                            {show && error.description && <p className="text-danger">{error.description}</p>}
                        </div>

                        <div className="row">

                            {/* Start Date */}
                            <div className="col-md-6 mb-3">
                                <label>Start Date *</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={data.startDate}
                                    onChange={getInputData}
                                    className={`form-control border-3 ${show && error.startDate ? "border-danger" : "border-primary"}`}
                                />
                                {show && error.startDate && <p className="text-danger">{error.startDate}</p>}
                            </div>

                            {/* End Date */}
                            <div className="col-md-6 mb-3">
                                <label>End Date *</label>
                                <input
                                    type="text"
                                    name="endDate"
                                    value={data.endDate}
                                    onChange={getInputData}
                                    placeholder="Current or YYYY-MM-DD"
                                    className={`form-control border-3 ${show && error.endDate ? "border-danger" : "border-primary"}`}
                                />
                                {show && error.endDate && <p className="text-danger">{error.endDate}</p>}
                            </div>
                        </div>

                        {/* Active */}
                        <div className="mb-3">
                            <label>Active *</label>
                            <select
                                name="active"
                                value={data.active ? "1" : "0"}
                                onChange={getInputData}
                                className="form-select border-3 border-primary"
                            >
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Update Experience</button>
                    </form>
                </div>
            </div>
        </>
    )
}
