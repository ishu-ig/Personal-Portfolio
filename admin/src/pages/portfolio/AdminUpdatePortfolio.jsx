import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import formValidator from '../../FormValidators/formValidator'
import imageValidator from '../../FormValidators/imageValidator'

import { updatePortfolio,getPortfolio} from "../../Redux/ActionCreartors/PortfolioActionCreators"

var rte
export default function AdminUpdatePortfolio() {
    let { _id } = useParams()  //in case of real backend
    // let { id } = useParams()
    var refdiv = useRef(null)

    let [data, setData] = useState({
        name: "",
        shortDescription:"",
        longDescription: "",
        pic: "",
        liveUrl:"",
        githubRepo:"",
        tech:"",
        category:"",
        active: true
    })
    let [error, setError] = useState({
        name: "",
        shortDescription:"",
        category:"",
        pic: "",
        liveUrl:"",
        githubRepo:"",
    })
    let [show, setShow] = useState(false)
    let navigate = useNavigate()

    let PortfolioStateData = useSelector((state) => state.PortfolioStateData)
    let dispatch = useDispatch()

    function getInputData(e) {
        let name = e.target.name
        let value = e.target.files ? e.target.files[0] : e.target.value  //in case of real backend
        // let value = e.target.files ? data.pic.concat(Array.from(e.target.files).map(x => "portfolio/" + x.name)) : e.target.value

        if (name !== "active") {
            setError((old) => {
                return {
                    ...old,
                    [name]: e.target.files ? imageValidator(e) : formValidator(e)
                }
            })
        }
        setData((old) => {
            return {
                ...old,
                [name]: name === "active" || name === "stock" ? (value === "1" ? true : false) : value
            }
        })
    }
    function postSubmit(e) {
        e.preventDefault()
        let errorItem = Object.values(error).find(x => x !== "")
        if (errorItem)
            setShow(true)
        else {

            // //in case of real backend and form has a file field
            let formData = new FormData()
                        formData.append("_id", data._id)
                        formData.append("name", data.name)
                        formData.append("shortDescription", data.shortDescription)
                        formData.append("category", data.category)
                        formData.append("tech", data.tech)
                        formData.append("liveUrl", data.liveUrl)
                        formData.append("githubRepo", data.githubRepo)
                        formData.append("pic", data.pic)
                        formData.append("longDescription", rte.getHTMLCode())
                        formData.append("active", data.active)
                        console.log(formData)
                        dispatch(updatePortfolio(formData))

            navigate("/portfolio")
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getPortfolio())
            if (PortfolioStateData.length) {
                // let item = PortfolioStateData.find(x => x.id === id)
                let item = PortfolioStateData.find(x => x._id === _id)
                setData({ ...item })
                rte = new window.RichTextEditor(refdiv.current);
                rte.setHTMLCode(item.longDescription);

            }
        })()
    }, [PortfolioStateData.length])
    return (
        <>
            <div>
                <h5 className='bg-primary text-light text-center p-2'>Portfolio <Link to="/admin/portfolio"><i className='fa fa-arrow-left text-light float-end'></i></Link></h5>
                <div className="card mt-3 shadow-sm p-4">
                <form onSubmit={postSubmit}>
                    <div className="mb-3">
                        <label>Portfolio Name*</label>
                        <input type="text" name="name" onChange={getInputData} value={data.name} placeholder='Portfolio Name' className={`form-control border-3 ${show && error.name ? 'border-danger' : 'border-primary'}`} />
                        {show && error.name ? <p className='text-danger text-capitalize'>{error.name}</p> : null}
                    </div>

                    <div className='mb-3'>
                        <label>Short Description</label>
                        <textarea name="shortDescription" placeholder='Short Description........' value={data.shortDescription} onChange={getInputData} className={`form-control border-3 ${show && error.shortDescription ? 'border-danger' : 'border-primary'}`} id=""></textarea>
                        {show && error.shortDescription ? <p className='text-danger text-capitalize'>{error.shortDescription}</p> : null}
                    </div>
                    <div className="mb-3">
                        <label>Description*</label>
                        <div ref={refdiv} className='border-3 border-primary'></div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label>Category*</label>
                            <input type="text" name="category" value={data.category} onChange={getInputData} placeholder='Portfolio Category' className={`form-control border-3 ${show && error.category ? 'border-danger' : 'border-primary'}`} />
                            {show && error.category ? <p className='text-danger text-capitalize'>{error.category}</p> : null}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Technology*</label>
                            <input type="text" name="tech" onChange={getInputData} value={data.tech} placeholder='Technology Used' className={`form-control border-3 ${show && error.tech ? 'border-danger' : 'border-primary'}`} />
                            {show && error.tech ? <p className='text-danger text-capitalize'>{error.tech}</p> : null}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label>Live URL*</label>
                            <input type="url" name="liveUrl" onChange={getInputData} value={data.liveUrl} placeholder='Live Url' className={`form-control border-3 border-primary`} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Github URL*</label>
                            <input type="url" name="githubRepo" onChange={getInputData} value={data.githubRepo} placeholder='Github Repo Url' className={`form-control border-3 border-primary`} />
                            
                        </div>
                    </div>
                    


                    <div className="row">
                    <div className="col-md-6 mb-3">
                            <label>Pic*</label>
                            <input type="file" name="pic" onChange={getInputData} className={`form-control border-3 ${show && error.pic ? 'border-danger' : 'border-primary'}`} />
                            {show && error.pic ? <p className='text-danger text-capitalize'>{error.pic}</p> : null}
                                
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Active*</label>
                            <select name="active" onChange={getInputData} value={data.active ? "1" : "0"} className='form-select border-3 border-primary'>
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
