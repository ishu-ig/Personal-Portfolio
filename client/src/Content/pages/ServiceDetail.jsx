"use client";
import React, { useEffect, useState } from "react";
import { getService } from "../Redux/ActionCreartors/ServiceActionCreators";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ServiceDetails() {
  let { id } = useParams(); // URL param
  let [data, setData] = useState(null);
  let [relatedData, setRelatedData] = useState([]);
  let [showModal, setShowModal] = useState(false);

  let ServiceStateData = useSelector((state) => state.ServiceStateData);
  let dispatch = useDispatch();
  let router = useRouter();

  // fetch services
  useEffect(() => {
    dispatch(getService());
  }, [dispatch]);

  // match selected service + related services
  useEffect(() => {
    if (ServiceStateData && ServiceStateData.length > 0) {
      // match service by _id
      let selected = ServiceStateData.find((x) => x._id == id);
      setData(selected || null);

      // filter remaining services
      let others = ServiceStateData.filter((x) => x._id != id);
      setRelatedData(others);
    }
  }, [ServiceStateData, id]);

  // open modal when user clicks Get Service
  const handleGetService = () => {
    setShowModal(true);
  };

  // when user confirms in modal: navigate to home and scroll to contact
  const handleProceedToContact = () => {
    setShowModal(false);
    router.push("/");

    // small delay so home page content mounts, then scroll to contact
    setTimeout(() => {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  // close modal helper
  const closeModal = () => setShowModal(false);

  // close modal on ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (showModal) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showModal]);

  // loading state
  if (!data) {
    return <div className="text-center py-5">Loading service details...</div>;
  }

  return (
    <>
      {/* ---------------------- Service Details ---------------------- */}
      <section className="project-details py-5">
        <div className="container text-center">
          <h2 className="section-title" style={{ color: "var(--text-color)" }}>
            {data.name}
          </h2>

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

          <p className="short-description mt-5">{data.shortDescription}</p>
          <hr />

          <div
            className="long-description"
            dangerouslySetInnerHTML={{ __html: data.longDescription }}
            style={{ maxWidth: "800px", margin: "0 auto" }}
          ></div>

          <div className="project-meta mt-4">
            <p>
              <strong className="fs-5">Category : </strong> {data.category}
            </p>
            <p>
              <strong className="fs-5">Price : </strong> {data.price}
            </p>
            <p>
              <strong className="fs-5">Duration : </strong> {data.duration} Weeks
            </p>
            <p>
              <strong className="fs-5">Tech Stack :</strong> {data.technology}
            </p>
          </div>

          <div className="mt-4">
            <button className="btn btn-success me-3 py-3" onClick={handleGetService}>
              Get Service
            </button>

            <Link href="/" className="btn btn-secondary py-3 px-5">
              Home
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------- Related Services ---------------------- */}
      <section id="services" className="services-section py-5">
        <div className="container text-center">
          <h2 className="section-title">Other Services</h2>

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

          <p className="section-description mb-3">
            Discover how our AI-driven solutions enhance your health and well-being.
          </p>

          <div className="row g-4 mt-5 justify-content-center">
            {relatedData.map((service) => (
              <div className="col-md-6 col-lg-4" key={service._id}>
                <div
                  className="service-card"
                  style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
                >
                  <div className="service-icon">
                    <i className={service.icon}></i>
                  </div>

                  <h3 className="service-title">{service.name}</h3>
                  <p className="service-description">{service.shortDescription}</p>

                  <Link href={`/serviceDetail/${service._id}`} className="btn btn-secondary py-2">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------- Modal ---------------------- */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            // close when clicking overlay (but not when clicking modal content)
            if (e.target.classList.contains("modal-overlay")) closeModal();
          }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-content" role="document" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} aria-label="Close">
              &times;
            </button>

            <div className="modal-body">
              <h3>{data.name}</h3>
              <p className="mb-2">{data.shortDescription}</p>
              <div
                dangerouslySetInnerHTML={{ __html: data.longDescription }}
                style={{ maxHeight: "260px", overflowY: "auto" }}
              ></div>

              <div className="mt-3">
                <p>
                  <strong>Price:</strong> {data.price}
                </p>
                <p>
                  <strong>Duration:</strong> {data.duration} Weeks
                </p>
                <p>
                  <strong>Tech Stack:</strong> {data.technology}
                </p>
              </div>

              <div className="modal-actions mt-3">
                <button className="btn btn-success me-2" onClick={handleProceedToContact}>
                  Proceed to Contact
                </button>
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>

          {/* Inline minimal styles for modal; you can move these to your stylesheet */}
          <style jsx>{`
            .modal-overlay {
              position: fixed;
              inset: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(0, 0, 0, 0.5);
              z-index: 9999;
              padding: 1rem;
            }
            .modal-content {
              background: var(--bg-color, #fff);
              color: var(--text-color, #000);
              max-width: 700px;
              width: 100%;
              border-radius: 12px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
              position: relative;
              padding: 1.25rem;
            }
            .modal-close {
              position: absolute;
              top: 8px;
              right: 10px;
              background: transparent;
              border: none;
              font-size: 1.5rem;
              line-height: 1;
              cursor: pointer;
            }
            .modal-body h3 {
              margin-bottom: 0.25rem;
            }
            .modal-actions .btn {
              min-width: 140px;
            }
            @media (max-width: 576px) {
              .modal-content {
                padding: 0.75rem;
                border-radius: 8px;
              }
              .modal-actions .btn {
                width: 100%;
                margin-bottom: 0.5rem;
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
