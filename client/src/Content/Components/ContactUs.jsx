"use client"
import React, { useContext, useState } from "react";
import { ThemeContext } from "../ThemeContext";
import { useDispatch } from "react-redux";
import formValidator from "../FormValidators/formValidator";
import { createContactUs } from "../Redux/ActionCreartors/ContactUsActionCreators";

export default function ContactUs() {
    const { theme } = useContext(ThemeContext);
    let dispatch = useDispatch();

    // Form Data State
    let [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });

    // Error Message State
    let [errorMessage, setErrorMessage] = useState({
        name: "Name field is mandatory",
        email: "Email field is mandatory",
        phone: "Phone field is mandatory",
        subject: "Subject field is mandatory",
        message: "Message field is mandatory",
    });

    let [show, setShow] = useState(false);

    // 🔥 Dynamic Contact Text
    const defaultText = "Have questions? We are here to help. Reach out to us anytime.";
    const thankYouText = "Thank you for contacting us! We will reach out to you soon.";
    const [displayText, setDisplayText] = useState(defaultText);

    function getInputData(e) {
        let { name, value } = e.target;
        setErrorMessage((old) => ({
            ...old,
            [name]: formValidator(e)
        }));
        setData((old) => ({
            ...old,
            [name]: value
        }));
    }

    function postData(e) {
        e.preventDefault();
        let error = Object.values(errorMessage).find((x) => x !== "");
        if (error) {
            setShow(true);
            console.log(error);
        } else {
            // Submit Data
            dispatch(createContactUs({ ...data, active: true, date: new Date() }));

            // Reset Form
            setData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: ""
            });

            // Change text to thank you message
            setDisplayText(thankYouText);

            // After 1 minute revert back
            setTimeout(() => {
                setDisplayText(defaultText);
            }, 20000);
        }
    }

    return (
        <>
            <section
                id="contact"
                className="contact section mt-5"
                style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
            >
                <div className="container" data-aos="fade-up" data-aos-delay="100">
                    <div className="row g-5">

                        {/* Left Section */}
                        <div className="col-lg-6">
                            <div className="content" data-aos="fade-up" data-aos-delay="200">
                                <div className="section-category mb-3">Contact</div>
                                <h2 className="display-5 mb-4">Get in Touch</h2>

                                {/* 🔥 Dynamic text here */}
                                <p className="lead mb-4" style={{ color: "var(--text-color)" }}>
                                    {displayText}
                                </p>
                            </div>
                        </div>

                        {/* Right Section - Form */}
                        <div className="col-lg-6">
                            <div className="contact-form card shadow-lg">
                                <div className="card-body p-4 p-lg-5">
                                    <form onSubmit={postData}>
                                        {["name", "email", "phone", "subject"].map((field, index) => (
                                            <div className="mb-3" key={index}>
                                                <input
                                                    type={field === "email" ? "email" : field === "phone" ? "number" : "text"}
                                                    name={field}
                                                    value={data[field]}
                                                    onChange={getInputData}
                                                    className={`form-control border-3 py-3 ${
                                                        show && errorMessage[field] ? "border-danger" : "border-success"
                                                    }`}
                                                    placeholder={
                                                        show && errorMessage[field]
                                                            ? `${errorMessage[field]}`
                                                            : `Your ${field.charAt(0).toUpperCase() + field.slice(1)}`
                                                    }
                                                />
                                            </div>
                                        ))}

                                        <div className="mb-3">
                                            <textarea
                                                name="message"
                                                className={`w-100 form-control border-3 py-2 ${
                                                    show && errorMessage.message ? "border-danger" : "border-success"
                                                }`}
                                                rows="4"
                                                onChange={getInputData}
                                                value={data.message}
                                                placeholder={
                                                    show && errorMessage.message
                                                        ? "Message field is mandatory"
                                                        : "Your Message"
                                                }
                                            ></textarea>
                                        </div>

                                        <button type="submit" className="btn w-100 btn-primary py-3">
                                            Send Message
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <div style={{ marginBottom: "80px" }}></div>

            <style>
                {`
                .contact-form .btn {
                    font-size: 1.1rem;
                    transition: all 0.3s ease-in-out;
                }
                .contact-form .btn:hover {
                    background-color: var(--accent-color);
                    transform: scale(1.05);
                }
                `}
            </style>
        </>
    );
}
