import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'


import formValidator from '../../FormValidators/formValidator'

import { createSkill, getSkill } from "../../Redux/ActionCreartors/SkillActionCreators"

export default function AdminCreateSkill() {
    let [data, setData] = useState({
        name: "",
        description: "",
        level: "",
        active: true
    })
    let [error, setError] = useState({
        name: "Name Field is Mendatory",
        description: "Description Field is Mendatory",
        level: "Level Field is Mendatory"
    })
    let [show, setShow] = useState(false)
    let navigate = useNavigate()


    let SkillStateData = useSelector(state => state.SkillStateData)
    let dispatch = useDispatch()

    function getInputData(e) {
        let name = e.target.name
        let value =  e.target.value  //in case of real backend
        // let value = e.target.files ? "Skill/" + e.target.files[0].name : e.target.value

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
            let item = SkillStateData.find(x => x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase())
            if (item) {
                setShow(true)
                setError((old) => {
                    return {
                        ...old,
                        "name": "Skill Already Exist"
                    }
                })
            }
            else {
                dispatch(createSkill({ ...data }))

                // //in case of real backend and form has a file field
                // let formData = new FormData()
                // formData.append("name", data.name)
                // formData.append("description", data.description)
                // formData.append("level", data.level)
                // formData.append("active", data.active)
                // dispatch(createSkill(formData))

                navigate("/skill")
            }
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getSkill())
        })()
    }, [SkillStateData.length])

    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">Create Skill <Link to="/skill"><i className="fa fa-arrow-left text-light float-end pt-1"></i></Link></h5>
                {/* Form */}
                <div className="card mt-3 shadow-sm p-4">
                    <form onSubmit={postSubmit}>
                        <div className="mb-3">
                            <label>Skill Name*</label>
                            <input type="text" name="name" onChange={getInputData} placeholder='Skill Name' className={`form-control border-3 ${show && error.name ? 'border-danger' : 'border-primary'}`} />
                            {show && error.name ? <p className='text-danger text-capitalize'>{error.name}</p> : null}
                        </div>
                        <div className="mb-3">
                            <label>Description*</label>
                            <textarea name="description" onChange={getInputData} className={`form-control border-3 ${show && error.description ? 'border-danger' : 'border-primary'}`} placeholder='Message...' rows={5}></textarea>
                            {show && error.description ? <p className='text-danger text-capitalize'>{error.description}</p> : null}
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Level*</label>
                                <input type="Number" name="level" onChange={getInputData} className={`form-control border-3 ${show && error.level ? 'border-danger' : 'border-primary'}`} />
                                {show && error.level ? <p className='text-danger text-capitalize'>{error.level}</p> : null}
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
                            <button type="submit" className='btn btn-primary w-100 text-light'>Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
