import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import imageValidator from "../FormValidators/imageValidator";
import formValidator from "../FormValidators/formValidator";

export default function UpdateProfilePage() {
  const [data, setData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pin: "",
    pic: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    name: "",
    phone: "",
    pic: "",
  });

  const [show, setShow] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  // Handle input changes
  function getInputData(e) {
    const { name, files, value } = e.target;
    const inputValue = files ? files[0] : value;

    // Validation
    if (name !== "active") {
      setErrorMessage((old) => ({
        ...old,
        [name]: files ? imageValidator(e) : formValidator(e),
      }));
    }

    // Update data
    setData((old) => ({
      ...old,
      [name]: inputValue,
    }));

    // Instant image preview
    if (files && files[0]) setPreview(URL.createObjectURL(files[0]));
  }

  // Handle form submit
  async function postData(e) {
    e.preventDefault();
    const error = Object.values(errorMessage).find((x) => x !== "");
    if (error) return setShow(true);

    try {
      const formData = new FormData();
      formData.append("_id", data._id);
      formData.append("name", data.name);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("pin", data.pin);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("pic", data.pic);

      let response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`,
        {
          method: "PUT",
          headers: { authorization: localStorage.getItem("token") },
          body: formData,
        }
      );

      response = await response.json();

      if (response.result === "Done") {
        navigate("/profile");
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Internal Server Error");
    }
  }

  // Fetch existing profile data
  useEffect(() => {
    (async () => {
      try {
        let response = await fetch(
          `${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              authorization: localStorage.getItem("token"),
            },
          }
        );
        response = await response.json();
        if (response.result === "Done") {
          setData(response.data);
          if (response.data.pic)
            setPreview(`${process.env.REACT_APP_BACKEND_SERVER}/${response.data.pic}`);
        }
      } catch (error) {
        alert("Internal Server Error");
      }
    })();
  }, []);

  return (
    <div className="container my-5">
      <div
        className="card shadow-lg border-0 mx-auto p-4"
        style={{
          maxWidth: "650px",
          borderRadius: "16px",
          backgroundColor: "#fff",
        }}
      >
        <h4 className="text-center text-primary mb-4 fw-semibold">
          Update Profile
        </h4>

        {/* Profile Image */}
        <div className="text-center position-relative mb-4">
          <img
            src={preview || "/img/noimage.jpg"}
            alt="Profile"
            className="rounded-circle shadow-sm"
            style={{
              width: "130px",
              height: "130px",
              objectFit: "cover",
              border: "3px solid #e0e0e0",
            }}
          />
          <label
            htmlFor="pic"
            className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 shadow-sm"
            style={{
              cursor: "pointer",
              transform: "translate(20%, -20%)",
              fontSize: "14px",
            }}
          >
            <i className="fa fa-camera"></i>
          </label>
          <input
            id="pic"
            type="file"
            name="pic"
            accept="image/*"
            className="d-none"
            onChange={getInputData}
          />
        </div>

        {/* Form */}
        <form onSubmit={postData}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="fw-bold mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={getInputData}
                className={`form-control shadow-sm ${
                  show && errorMessage.name ? "border-danger" : "border-primary"
                }`}
                placeholder="Enter your full name"
              />
              {show && errorMessage.name && (
                <small className="text-danger">{errorMessage.name}</small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-bold mb-1">Phone Number</label>
              <input
                type="number"
                name="phone"
                value={data.phone}
                onChange={getInputData}
                className={`form-control shadow-sm ${
                  show && errorMessage.phone
                    ? "border-danger"
                    : "border-primary"
                }`}
                placeholder="Enter phone number"
              />
              {show && errorMessage.phone && (
                <small className="text-danger">{errorMessage.phone}</small>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="fw-bold mb-1">Address</label>
            <textarea
              name="address"
              value={data.address}
              onChange={getInputData}
              className="form-control shadow-sm border-primary"
              placeholder="Enter your address"
              rows={3}
            ></textarea>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="fw-bold mb-1">State</label>
              <input
                type="text"
                name="state"
                value={data.state}
                onChange={getInputData}
                className="form-control shadow-sm border-primary"
                placeholder="Enter your state"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-bold mb-1">City</label>
              <input
                type="text"
                name="city"
                value={data.city}
                onChange={getInputData}
                className="form-control shadow-sm border-primary"
                placeholder="Enter your city"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="fw-bold mb-1">Pin Code</label>
            <input
              type="number"
              name="pin"
              value={data.pin}
              onChange={getInputData}
              className="form-control shadow-sm border-primary"
              placeholder="Enter pin code"
            />
          </div>

          <div className="d-flex gap-3 mt-4">
            <button
              type="submit"
              className="btn btn-primary text-light fw-semibold w-50 shadow-sm"
            >
              <i className="fa fa-save me-2"></i> Update
            </button>

            <Link
              to="/profile"
              className="btn btn-outline-secondary fw-semibold w-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
