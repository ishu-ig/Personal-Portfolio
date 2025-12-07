import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import formValidator from '../../FormValidators/formValidator'
import imageValidator from '../../FormValidators/imageValidator'

import { createBlog } from "../../Redux/ActionCreartors/BlogActionCreators"

var rte

export default function AdminCreateBlog() {
    var refdiv = useRef(null);

    let [data, setData] = useState({
        title: "",
        shortDescription: "",
        category: "",
        tags: "",
        author: "",
        pic: [],
        active: true
    })

    let [error, setError] = useState({
        title: "Title is mandatory",
        shortDescription: "Short description is mandatory",
        category: "Category is mandatory",
        author: "Author name is mandatory",
        pic: "Blog image is mandatory"
    })

    let [show, setShow] = useState(false)
    let navigate = useNavigate()
    let dispatch = useDispatch()

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

    function postSubmit(e) {
        e.preventDefault()

        let errorItem = Object.values(error).find(x => x !== "")
        if (errorItem) {
            setShow(true)
        } else {

            let formData = new FormData()
            formData.append("title", data.title)
            formData.append("shortDescription", data.shortDescription)
            formData.append("category", data.category)
            formData.append("tags", data.tags)
            formData.append("author", data.author)
            formData.append("pic", data.pic)
            formData.append("longDescription", rte.getHTMLCode())
            formData.append("active", data.active)

            dispatch(createBlog(formData))

            navigate("/blog")
        }
    }

    useEffect(() => {
        rte = new window.RichTextEditor(refdiv.current);
        rte.setHTMLCode("");
    }, [])

    return (
        <>
            <div>
                <h5 className="bg-primary text-light text-center p-2">
                    Create Blog
                    <Link to="/blog">
                        <i className="fa fa-arrow-left text-light float-end"></i>
                    </Link>
                </h5>

                <div className="card mt-3 shadow-sm p-4">
                    <form onSubmit={postSubmit}>

                        {/* Title */}
                        <div className="mb-3">
                            <label>Blog Title *</label>
                            <input
                                type="text"
                                name="title"
                                onChange={getInputData}
                                placeholder="Enter blog title"
                                className={`form-control border-3 ${show && error.title ? "border-danger" : "border-primary"}`}
                            />
                            {show && error.title && <p className="text-danger">{error.title}</p>}
                        </div>

                        {/* Short Description */}
                        <div className="mb-3">
                            <label>Short Description *</label>
                            <textarea
                                name="shortDescription"
                                placeholder="Short summary..."
                                onChange={getInputData}
                                className={`form-control border-3 ${show && error.shortDescription ? "border-danger" : "border-primary"}`}
                                rows={3}
                            ></textarea>
                            {show && error.shortDescription && <p className="text-danger">{error.shortDescription}</p>}
                        </div>

                        {/* Long Description */}
                        <div className="mb-3">
                            <label>Blog Content *</label>
                            <div ref={refdiv} className="border-3 border-primary"></div>
                        </div>

                        <div className="row">

                            {/* Category */}
                            <div className="col-md-6 mb-3">
                                <label>Category *</label>
                                <input
                                    type="text"
                                    name="category"
                                    onChange={getInputData}
                                    placeholder="Blog category"
                                    className={`form-control border-3 ${show && error.category ? "border-danger" : "border-primary"}`}
                                />
                                {show && error.category && <p className="text-danger">{error.category}</p>}
                            </div>

                            {/* Tags */}
                            <div className="col-md-6 mb-3">
                                <label>Tags (comma separated)</label>
                                <input
                                    type="text"
                                    name="tags"
                                    onChange={getInputData}
                                    placeholder="e.g. react, node, webdev"
                                    className="form-control border-3 border-primary"
                                />
                            </div>
                        </div>

                        <div className="row">

                            {/* Author */}
                            <div className="col-md-6 mb-3">
                                <label>Author *</label>
                                <input
                                    type="text"
                                    name="author"
                                    onChange={getInputData}
                                    placeholder="Author name"
                                    className={`form-control border-3 ${show && error.author ? "border-danger" : "border-primary"}`}
                                />
                                {show && error.author && <p className="text-danger">{error.author}</p>}
                            </div>

                            {/* Active */}
                            <div className="col-md-6 mb-3">
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
                        </div>

                        {/* Blog Image */}
                        <div className="mb-3">
                            <label>Blog Image *</label>
                            <input
                                type="file"
                                name="pic"
                                onChange={getInputData}
                                className={`form-control border-3 ${show && error.pic ? "border-danger" : "border-primary"}`}
                            />
                            {show && error.pic && <p className="text-danger">{error.pic}</p>}
                        </div>

                        <button className="btn btn-primary w-100">Create Blog</button>
                    </form>
                </div>
            </div>
        </>
    )
}
