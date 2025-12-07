"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getCertificate } from '../Redux/ActionCreartors/CertificateActionCreators';
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Certificates() {
    const CertificateStateData = useSelector(state => state.CertificateStateData);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCertificate());

        AOS.init({
            duration: 1000,
            once: false
        });

        AOS.refresh();
    }, [dispatch]);

    return (
        <section id="certificate" className="container mt-5">
            <div className="text-center mb-5" data-aos="fade-up">
                <h2 className="section-title" style={{ color: "var(--text-color)" }}>
                    Certificates
                </h2>

                <div className="title-shape" data-aos="fade-up" data-aos-delay={100}>
                    <svg viewBox="0 0 200 20">
                        <path 
                            d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                        />
                    </svg>
                </div>

                <p className="section-subtitle" data-aos="fade-up" data-aos-delay={200} style={{ color: "var(--text-color)" }}>
                    Showcasing my professional certifications that validate my expertise.
                </p>
            </div>

            <div className="row justify-content-center">
                {CertificateStateData.filter(x => x.active).map((cert, index) => (
                    <div
                        key={cert._id}
                        className="col-6  col-lg-4 mb-4"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <div className="card certificate-card shadow-sm">
                            <Link 
                                href={`${process.env.NEXT_PUBLIC_BACKEND_SERVER}/${cert.pic}`} 
                                target="_blank"
                            >
                                <img
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER}/${cert.pic}`}
                                    className="card-img-top"
                                    height={100}
                                    style={{ backgroundColor: "var(--bg-color)" }}
                                    alt={cert.title}
                                />
                            </Link>

                            <div className="card-body text-center mb-look">
                                <h5 className="card-title">{cert.name}</h5>
                                <p className="card-text ">{cert.issuedBy}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
