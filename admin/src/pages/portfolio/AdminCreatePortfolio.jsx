import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, } from 'react-redux'

import formValidator from '../../FormValidators/formValidator'
import imageValidator from '../../FormValidators/imageValidator'

import { createPortfolio } from "../../Redux/ActionCreartors/PortfolioActionCreators"

var rte

export default function AdminCreatePortfolio() {
    var refdiv = useRef(null);

    let [data, setData] = useState({
        name: "",
        shortDescription:"",
        longDescription:"",
        tech:"",
        category:"",
        liveUrl:"",
        githubRepo:"",
        pic: [],
        active: true
    })
    let [error, setError] = useState({
        name: "Name Field is Mendatory",
        shortDescription: "Short Description Field is Mendatory",
        category: "Category Field is Mendatory",
        tech: "Technology Field is Mendatory",
        pic: "Pic Field is Mendatory"
    })
    let [show, setShow] = useState(false)
    let navigate = useNavigate()
    let dispatch = useDispatch()

    function getInputData(e) {
        let name = e.target.name
        let value = e.target.files ? e.target.files[0] : e.target.value  //in case of real backend
        // let value = e.target.files ? Array.from(e.target.files).map(x => "Portfolio/" + x.name) : e.target.value

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
                [name]: name === "active" ? (value === "1" ? true : false) : value
            }
        })
    }
    function postSubmit(e) {
        console.log("Enter post function")
        e.preventDefault()
        let errorItem = Object.values(error).find(x => x !== "")
        if (errorItem)
        {
            console.log(errorItem)
            setShow(true)
        console.log(show)
        }
        else {
            console.log("enter else")
            
            // dispatch(createPortfolio({
            //     ...data,
            //     'maincategory': data.maincategory ? data.maincategory : MaincategoryStateData[0].name,
            //     'subcategory': data.subcategory ? data.subcategory : SubcategoryStateData[0].name,
            //     'brand': data.brand ? data.brand : BrandStateData[0].name,
            //     'basePrice': bp,
            //     'discount': d,
            //     'finalPrice': fp,
            //     'stockQuantity': stockQuantity,
            //     'description': rte.getHTMLCode()
            // }))

            // //in case of real backend and form has a file field
            let formData = new FormData()
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
            dispatch(createPortfolio(formData))

            navigate("/portfolio")
        }
    }

    useEffect(() => {
        rte = new window.RichTextEditor(refdiv.current);
        rte.setHTMLCode("");
    }, [])
    return (
        <>
            <div>
                <h5 className='bg-primary text-light text-center p-2'>Portfolio <Link to="/portfolio"><i className='fa fa-arrow-left text-light float-end'></i></Link></h5>
                <div className="card mt-3 shadow-sm p-4">
                <form onSubmit={postSubmit}>
                    <div className="mb-3">
                        <label>Portfolio Name*</label>
                        <input type="text" name="name" onChange={getInputData} placeholder='Portfolio Name' className={`form-control border-3 ${show && error.name ? 'border-danger' : 'border-primary'}`} />
                        {show && error.name ? <p className='text-danger text-capitalize'>{error.name}</p> : null}
                    </div>

                    <div className='mb-3'>
                        <label>Short Description</label>
                        <textarea name="shortDescription" placeholder='Short Description........' onChange={getInputData} className={`form-control border-3 ${show && error.shortDescription ? 'border-danger' : 'border-primary'}`} id=""></textarea>
                        {show && error.shortDescription ? <p className='text-danger text-capitalize'>{error.shortDescription}</p> : null}
                    </div>
                    <div className="mb-3">
                        <label>Description*</label>
                        <div ref={refdiv} className='border-3 border-primary'></div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label>Category*</label>
                            <input type="text" name="category" onChange={getInputData} placeholder='Portfolio Category' className={`form-control border-3 ${show && error.category ? 'border-danger' : 'border-primary'}`} />
                            {show && error.category ? <p className='text-danger text-capitalize'>{error.category}</p> : null}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Technology*</label>
                            <input type="text" name="tech" onChange={getInputData} placeholder='Technology Used' className={`form-control border-3 ${show && error.tech ? 'border-danger' : 'border-primary'}`} />
                            {show && error.tech ? <p className='text-danger text-capitalize'>{error.tech}</p> : null}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label>Live URL*</label>
                            <input type="url" name="liveUrl" onChange={getInputData} placeholder='Live Url' className={`form-control border-3 border-primary`} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Github URL*</label>
                            <input type="url" name="githubRepo" onChange={getInputData} placeholder='Github Repo Url' className={`form-control border-3 border-primary`} />
                            
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
