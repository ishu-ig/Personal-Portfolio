"use client"
import React from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';

export default function About() {
    React.useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    const personalInfo = [
        { label: 'Name', value: 'Ishaan Gupta' },
        { label: 'Phone', value: '+91-8218635344' },
        { label: 'Age', value: '23 Years' },
        { label: 'Email', value: 'ishaanguptacse@gmail.com' },
        { label: 'Occupation', value: 'Full Stack Developer' },
        { label: 'Nationality', value: 'Indian' },
    ];

    return (
        <section
            id="about"
            className="about-section py-5"
            style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        >
            <div className="container">
                {/* Section Title */}
                <div className="text-center mb-5" data-aos="fade-up">
                    <h2 className="section-title" style={{ color: "var(--text-color)" }}>About</h2>
                    <div className="title-shape">
                        <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            ></path>
                        </svg>
                    </div>
                    <p className="section-subtitle" style={{ color: "var(--text-color)" }}>
                        Passionate about building scalable web applications and exploring the latest technologies in full stack development.
                    </p>
                </div>

                <div className="row align-items-center">
                    {/* Profile Image */}
                    <div className="col-lg-6 text-center" data-aos="fade-right">
                        <div className="about-image">
                            <img
                                src="/img/profile/my_image.jpg"
                                alt="Profile"
                                className="img-fluid rounded-4 shadow-lg"
                            />
                        </div>
                    </div>

                    {/* About Content */}
                    <div className="col-lg-6" data-aos="fade-left">
                        <div className="about-content">
                            <h3 className="subtitle">About Me</h3>
                            <h2 className="about-heading" style={{ color: "var(--text-color)" }}>
                                Full Stack Web Developer & Programmer
                            </h2>
                            <p className="lead" style={{ color: "var(--text-color)" }}>
                                I specialize in building modern web applications using cutting-edge technologies like React, Node.js, MongoDB, and more. I enjoy solving complex problems and continuously improving my coding skills.
                            </p>
                            <p className="mb-5" style={{ color: "var(--text-color)" }}>
                                My goal is to develop innovative and efficient solutions that enhance user experience and drive business success.
                            </p>

                            {/* Personal Info Cards */}
                            <div className="personal-info" style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
                                {personalInfo.map((item, index) => (
                                    <div key={index} className="info-card">
                                        <p><strong>{item.label}:</strong></p>
                                        <p>{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
