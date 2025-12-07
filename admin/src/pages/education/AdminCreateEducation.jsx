import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'


import formValidator from '../../FormValidators/formValidator'

import { createEducation, getEducation } from "../../Redux/ActionCreartors/EducationActionCreators"

export default function AdminCreateEducation() {
    let [data, setData] = useState({

        degreeName: "",
        instituteName: "",
        startDate: "",
        endDate: "Current",
        description: "",
        active: true
    })
    let [error, setError] = useState({
        degreeName: "Name Field is Mendatory",
        instituteName: "Company Name Field is Mendatory",
        startDate: "Start Date Field is Mendatory",
        description: "Description Field is Mendatory",
    })
    let [show, setShow] = useState(false)
    let navigate = useNavigate()


    let EducationStateData = useSelector(state => state.EducationStateData)
    let dispatch = useDispatch()

    function getInputData(e) {
        let name = e.target.name
        let value =  e.target.value  //in case of real backend
        // let value = e.target.files ? "Education/" + e.target.files[0].name : e.target.value

        if (name !== "active") {
            setError((old) => {
                return {
                    ...old,
                    [name]:formValidator(e)
                }
            })
        }
        setData((old) => {
            return {
                ...old,
                [name]: name === "active" ? (value === "1" ? true : false) : value
            }
        })
    }
    function postSubmit(e) {
        e.preventDefault()
        let errorItem = Object.values(error).find(x => x !== "")
        if (errorItem)
            setShow(true)
            else {
                dispatch(createEducation({ ...data }))

                // //in case of real backend and form has a file field
                // let formData = new FormData()
                // formData.append("name", data.name)
                // formData.append("description", data.description)
                // formData.append("level", data.level)
                // formData.append("active", data.active)
                // dispatch(createEducation(formData))

                navigate("/education")
            }
        
    }

    useEffect(() => {
        (() => {
            dispatch(getEducation())
        })()
    }, [EducationStateData.length])

    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">Create Education <Link to="/education"><i className="fa fa-arrow-left text-light float-end pt-1"></i></Link></h5>
                {/* Form */}
                <div className="card mt-3 shadow-sm p-4">
                    <form onSubmit={postSubmit}>
                        <div className="mb-3">
                            <label>Degree*</label>
                            <input type="text" name="degreeName" onChange={getInputData} placeholder='Education Name' className={`form-control border-3 ${show && error.degreeName ? 'border-danger' : 'border-primary'}`} />
                            {show && error.degreeName ? <p className='text-danger text-capitalize'>{error.degreeName}</p> : null}
                        </div>
                        <div className="mb-3">
                            <label>Description*</label>
                            <textarea name="description" onChange={getInputData} className={`form-control border-3 ${show && error.description ? 'border-danger' : 'border-primary'}`} placeholder='Message...' rows={5}></textarea>
                            {show && error.description ? <p className='text-danger text-capitalize'>{error.description}</p> : null}
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Start*</label>
                                <input type="date" name="startDate" onChange={getInputData} className={`form-control border-3 ${show && error.startDate ? 'border-danger' : 'border-primary'}`} />
                                {show && error.startDate ? <p className='text-danger text-capitalize'>{error.startDate}</p> : null}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>End Date*</label>
                                <input type="text" name="endDate" onChange={getInputData} className={`form-control border-3 ${show && error.endDate ? 'border-danger' : 'border-primary'}`} />
                                {show && error.endDate ? <p className='text-danger text-capitalize'>{error.endDate}</p> : null}
                            </div>
                            </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Institute Name*</label>
                                <input type="text" name="instituteName" onChange={getInputData} className={`form-control border-3 ${show && error.instituteName ? 'border-danger' : 'border-primary'}`} />
                                {show && error.instituteName ? <p className='text-danger text-capitalize'>{error.instituteName}</p> : null}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Active*</label>
                                <select name="active" onChange={getInputData} className='form-select border-3 border-primary'>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <button type="submit" className='btn btn-primary w-100 -text-light'>Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
