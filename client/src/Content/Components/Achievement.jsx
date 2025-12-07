"use client";
import React, { useState, useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";

export default function Achievement() {
  const [counters, setCounters] = useState([
    {
      icon: "fas fa-user-graduate",
      label: "Projects Built",
      target: 15,
      value: 0,
    },

    // HackerRank Card
    {
      icon: "fas fa-code",
      label: "HackerRank",
      stat: "5 Star Coder",
      isStatic: true,
    },

    // LeetCode Card
    {
      icon: "fas fa-lightbulb",
      label: "LeetCode",
      stat: "30 Problems Solved",
      isStatic: true,
    },

    {
      icon: "fas fa-award",
      label: "Certifications Earned",
      target: 10,
      value: 0,
    },
  ]);

  // AOS Initialization
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
    AOS.refresh();
  }, []);

  // Counter Animation
  useEffect(() => {
    const intervals = counters.map((counter, index) => {
      if (!counter.target) return null;

      let start = 0;
      const increment = Math.ceil(counter.target / 80);

      return setInterval(() => {
        start += increment;

        if (start >= counter.target) {
          start = counter.target;
          clearInterval(intervals[index]);
        }

        setCounters((prev) => {
          const updated = [...prev];
          updated[index] = { ...counter, value: start };
          return updated;
        });
      }, 30);
    });

    return () => intervals.forEach((i) => i && clearInterval(i));
  }, []);

  return (
    <section
      className="py-5 text-center"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <div className="container">
        <h2 data-aos="fade-down">
          Achievements
        </h2>
        <div className="title-shape" data-aos="fade-up" data-aos-delay={100}>
          <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <p
          className="section-description mb-3 mt-2"
          data-aos="fade-up"
          data-aos-delay={200}
          style={{ color: "var(--text-color)" }}
        >
          Showcasing What I Have Achieved So Far
        </p>

        <div className="row g-4">
          {counters.map((counter, index) => (
            <div
              key={index}
              className="col-6 col-md-6 col-lg-3"
              data-aos="fade-up"
              data-aos-delay={index * 200}
            >
              {/* STATIC CARDS */}
              {counter.isStatic ? (
                <div className="achievement-card p-4 shadow-lg text-center d-flex flex-column align-items-center justify-content-center">
                  <i
                    className={`${counter.icon} icon-achievement mb-3 text-primary`}
                  ></i>

                  <h4 className="fw-bold">{counter.label}</h4>

                  <p className="text-success mt-1 stat-text">{counter.stat}</p>
                </div>
              ) : (
                // ANIMATED CARDS
                <div className="achievement-card p-4 shadow-lg text-center d-flex flex-column align-items-center justify-content-center">
                  <i
                    className={`${counter.icon} icon-achievement mb-3 text-primary`}
                  ></i>

                  <h2 className="fw-bold count-number">{counter.value}</h2>

                  <p className="count-label">{counter.label}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
