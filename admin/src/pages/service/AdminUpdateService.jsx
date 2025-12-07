import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'


import formValidator from '../../FormValidators/formValidator'


import { getService, updateService } from "../../Redux/ActionCreartors/ServiceActionCreators"
var rte
export default function AdminUpdateService() {
    var refdiv = useRef(null)
    let { _id } = useParams()  //in case of real backend
    // let { id } = useParams()
    let [data, setData] = useState({
        name: "",
        shortDescription: "",
        longDescription: "",
        category: "",
        price: "",
        duration: "",
        icon: "",
        technology: "",
        active: true
    })
    let [error, setError] = useState({
        name: "",
        shortDescription: "",
        longDescription: "",
        category: "",
        price: "",
        duration: "",
        icon: "",
        technology: "",
    })
    let [show, setShow] = useState(false)
    let navigate = useNavigate()

    let ServiceStateData = useSelector(state => state.ServiceStateData)
    let dispatch = useDispatch()

    function getInputData(e) {
        let name = e.target.name
        let value = e.target.value  //in case of real backend
        // let value = e.target.files ? "Service/" + e.target.files[0].name : e.target.value

        if (name !== "active") {
            setError((old) => {
                return {
                    ...old,
                    [name]: formValidator(e)
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
            let item = ServiceStateData.find(x => x._id !== _id && x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase())  // in case of real backend
            // let item = ServiceStateData.find(x => x.id !== id && x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase())
            if (item) {
                setShow(true)
                setError((old) => {
                    return {
                        ...old,
                        "name": "Service Already Exist"
                    }
                })
            }
            else {
                dispatch(updateService({
                    ...data,
                    description: rte.getHTMLCode()
                }));
        
                // //in case of real backend and form has a file field
                // let formData = new FormData()
                // formData.append("_id", data._id)  //use id in case of RDBMS and use _id in case of mongodb
                // formData.append("name", data.name)
                // formData.append("description", data.description)
                // formData.append("level", data.level)
                // formData.append("active", data.active)
                // dispatch(updateService(formData))
                navigate("/service")
            }
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getService())
            if (ServiceStateData.length) {
                // let item = ServiceStateData.find(x => x.id === id)
                let item = ServiceStateData.find(x => x._id === _id) //in case of real backend
                setData({ ...item })
                rte = new window.RichTextEditor(refdiv.current);
                rte.setHTMLCode(item.longDescription);

            }
        })()
    }, [ServiceStateData.length])

    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">Update Service <Link to="/Service"><i className="fa fa-arrow-left text-light float-end pt-1"></i></Link></h5>
                {/* Form */}
                <div className="card mt-3 shadow-sm p-4">
                    <form onSubmit={postSubmit}>
                        <div className="mb-3">
                            <label>Service Name*</label>
                            <input type="text" value={data.name} name="name" onChange={getInputData} placeholder='Service Name' className={`form-control border-3 ${show && error.name ? 'border-danger' : 'border-primary'}`} />
                            {show && error.name ? <p className='text-danger text-capitalize'>{error.name}</p> : null}
                        </div>
                        <div className="mb-3">
                            <label>Short Description*</label>
                            <textarea name="shortDescription" value={data.shortDescription} onChange={getInputData} className={`form-control border-3 ${show && error.longDescription ? 'border-danger' : 'border-primary'}`} placeholder='Message...' rows={5}></textarea>
                            {show && error.longDescription ? <p className='text-danger text-capitalize'>{error.longDescription}</p> : null}
                        </div>
                        <div className="mb-3">
                            <label>Description*</label>
                            <div ref={refdiv} className='border-3 border-primary'></div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Category*</label>
                                <input type="text" value={data.category} name="category" onChange={getInputData} className={`form-control border-3 ${show && error.category ? 'border-danger' : 'border-primary'}`} />
                                {show && error.category ? <p className='text-danger text-capitalize'>{error.category}</p> : null}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Duration*</label>
                                <input type="Number" name="duration" value={data.duration} onChange={getInputData} className={`form-control border-3 ${show && error.duration ? 'border-danger' : 'border-primary'}`} />
                                {show && error.duration ? <p className='text-danger text-capitalize'>{error.duration}</p> : null}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Price*</label>
                                <input type="Number" name="price" value={data.price} onChange={getInputData} className={`form-control border-3 ${show && error.price ? 'border-danger' : 'border-primary'}`} />
                                {show && error.price ? <p className='text-danger text-capitalize'>{error.price}</p> : null}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Technology*</label>
                                <input type="text" name="technology" value={data.technology} onChange={getInputData} className={`form-control border-3 ${show && error.technology ? 'border-danger' : 'border-primary'}`} />
                                {show && error.technology ? <p className='text-danger text-capitalize'>{error.technology}</p> : null}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Icon*</label>
                                <input type="text" name="icon" value={data.icon} onChange={getInputData} className={`form-control border-3 ${show && error.icon ? 'border-danger' : 'border-primary'}`} />
                                {show && error.icon ? <p className='text-danger text-capitalize'>{error.icon}</p> : null}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Active*</label>
                                <select name="active" value={data.active ? "1" : "0"} onChange={getInputData} className='form-select border-3 border-primary'>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <button type="submit" className='btn btn-primary w-100 text-light'>Update</button>
                        </div>
                    </form>

                </div>
            </div>
        </>
    )
}
