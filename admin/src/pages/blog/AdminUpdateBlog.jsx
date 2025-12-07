import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import formValidator from '../../FormValidators/formValidator'
import imageValidator from '../../FormValidators/imageValidator'

import { updateBlog, getBlog } from "../../Redux/ActionCreartors/BlogActionCreators"

var rte

export default function AdminUpdateBlog() {

    let { _id } = useParams()
    var refdiv = useRef(null)

    let [data, setData] = useState({
        title: "",
        shortDescription: "",
        longDescription: "",
        category: "",
        tags: "",
        author: "",
        pic: "",
        active: true
    })

    let [error, setError] = useState({
        title: "",
        shortDescription: "",
        category: "",
        author: "",
        pic: ""
    })

    let [show, setShow] = useState(false)
    let navigate = useNavigate()

    let BlogStateData = useSelector((state) => state.BlogStateData)
    let dispatch = useDispatch()


    // -----------------------
    // INPUT HANDLING
    // -----------------------
    function getInputData(e) {
        let name = e.target.name
        let value = e.target.files ? e.target.files[0] : e.target.value

        if (name !== "active") {
            setError((old) => ({
                ...old,
                [name]: e.target.files ? imageValidator(e) : formValidator(e)
            }))
        }

        setData((old) => ({
            ...old,
            [name]: name === "active" ? (value === "1" ? true : false) : value
        }))
    }


    // -----------------------
    // UPDATE SUBMIT
    // -----------------------
    function postSubmit(e) {
        e.preventDefault()

        let errorItem = Object.values(error).find(x => x !== "")
        if (errorItem) {
            setShow(true)
        } else {

            let formData = new FormData()
            formData.append("_id", data._id)
            formData.append("title", data.title)
            formData.append("shortDescription", data.shortDescription)
            formData.append("category", data.category)
            formData.append("tags", data.tags)
            formData.append("author", data.author)

            // If user uploads new file → update image
            // Else → maintain old image
            if (typeof data.pic === "object") {
                formData.append("pic", data.pic)
            } else {
                formData.append("oldImage", data.pic)
            }

            formData.append("longDescription", rte.getHTMLCode())
            formData.append("active", data.active)

            dispatch(updateBlog(formData))
            navigate("/blog")
        }
    }


    // -----------------------
    // LOAD DATA ONCE READY
    // -----------------------
    useEffect(() => {
        dispatch(getBlog())

        if (BlogStateData.length) {
            let item = BlogStateData.find(x => x._id === _id)

            if (item) {
                setData({ ...item })

                // Initialize Rich Text Editor with existing content
                rte = new window.RichTextEditor(refdiv.current);
                rte.setHTMLCode(item.longDescription)
            }
        }
    }, [BlogStateData.length])


    return (
        <>
            <div>
                <h5 className='bg-primary text-light text-center p-2'>
                    Update Blog
                    <Link to="/blog">
                        <i className='fa fa-arrow-left text-light float-end'></i>
                    </Link>
                </h5>

                <div className="card mt-3 shadow-sm p-4">
                    <form onSubmit={postSubmit}>

                        {/* Blog Title */}
                        <div className="mb-3">
                            <label>Blog Title*</label>
                            <input
                                type="text"
                                name="title"
                                value={data.title}
                                onChange={getInputData}
                                placeholder='Blog Title'
                                className={`form-control border-3 ${show && error.title ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.title ? <p className='text-danger'>{error.title}</p> : null}
                        </div>

                        {/* Short Description */}
                        <div className='mb-3'>
                            <label>Short Description*</label>
                            <textarea
                                name="shortDescription"
                                value={data.shortDescription}
                                onChange={getInputData}
                                placeholder='Short description...'
                                className={`form-control border-3 ${show && error.shortDescription ? 'border-danger' : 'border-primary'}`}
                            ></textarea>
                            {show && error.shortDescription ? <p className='text-danger'>{error.shortDescription}</p> : null}
                        </div>

                        {/* Long Description */}
                        <div className="mb-3">
                            <label>Blog Content*</label>
                            <div ref={refdiv} className='border-3 border-primary'></div>
                        </div>


                        {/* Category & Tags */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Category*</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={data.category}
                                    onChange={getInputData}
                                    placeholder='Blog Category'
                                    className={`form-control border-3 ${show && error.category ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.category ? <p className='text-danger'>{error.category}</p> : null}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Tags (comma separated)</label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={data.tags}
                                    onChange={getInputData}
                                    placeholder='react, coding, frontend'
                                    className='form-control border-3 border-primary'
                                />
                            </div>
                        </div>


                        {/* Author & Active */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Author*</label>
                                <input
                                    type="text"
                                    name="author"
                                    value={data.author}
                                    onChange={getInputData}
                                    placeholder='Author name'
                                    className={`form-control border-3 ${show && error.author ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.author ? <p className='text-danger'>{error.author}</p> : null}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Active*</label>
                                <select
                                    name="active"
                                    value={data.active ? "1" : "0"}
                                    onChange={getInputData}
                                    className='form-select border-3 border-primary'
                                >
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                        </div>


                        {/* Blog Image */}
                        <div className="mb-3">
                            <label>Blog Image*</label>
                            <input
                                type="file"
                                name="pic"
                                onChange={getInputData}
                                className={`form-control border-3 ${show && error.pic ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.pic ? <p className='text-danger'>{error.pic}</p> : null}

                            {/* show existing image */}
                            {typeof data.pic === "string" && (
                                <div className="mt-2">
                                    <img
                                        src={`${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}`}
                                        alt="Blog"
                                        height={80}
                                        className="rounded shadow-sm"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <button type="submit" className='btn btn-primary w-100 text-light'>
                                Update Blog
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
