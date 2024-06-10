import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
const baseUrl = import.meta.env.VITE_API_BASE_URL

const Register = () => {
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    variant: "success",
    message: "",
  });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setAlertInfo({
          show: true,
          variant: "success",
          message: "User Registered!",
        });
      } else {
        setAlertInfo({
          show: true,
          variant: "danger",
          message: "Problem in Registration",
        });
      }
      setFormData({
        username: "",
        email: "",
        password: "",
        phone: "",
      });
    } catch (error) {
      console.error("Error:", error);
      setAlertInfo({
        show: true,
        variant: "danger",
        message: "An error occurred during registration",
      });
      setFormData({
        username: "",
        email: "",
        password: "",
        phone: "",
      });
    }
  };
  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex items-center justify-center">
        <input
          value={formData.username}
          onChange={handleInputChange}
          className="p-2 m-1 w-[90%] rounded-md font-semibold"
          type="text"
          name="username"
          id="username"
          placeholder="Enter your Full Name"
          required
        />
      </div>
      <div className="w-full flex items-center justify-center">
        <input
          className="mt-2 p-2 m-1 w-[90%] rounded-md font-semibold"
          value={formData.email}
          onChange={handleInputChange}
          type="text"
          name="email"
          id="email"
          placeholder="Enter your Email address"
          required
        />
      </div>
      <div className="w-full flex items-center justify-center">
        <input
          value={formData.password}
          className="mt-2 p-2 m-1 w-[90%] rounded-md font-semibold"
          onChange={handleInputChange}
          type="password"
          name="password"
          id="password"
          placeholder="Enter Your Password"
          required
        />
      </div>
      <div className="w-full flex items-center justify-center">
        <input
          value={formData.phone}
          className="mt-2 p-2 m-1 w-[90%] rounded-md font-semibold"
          onChange={handleInputChange}
          type="number"
          name="phone"
          id="phone"
          placeholder="Enter Mobile Number without country code"
          required
          minLength={10}
        />
      </div>
      <button
        onClick={handleRegister}
        className="mt-2 font-semibold p-2 px-6 rounded-md bg-blue-600 text-white hover:bg-blue-700 duration-200"
        type="submit"
      >
        Register
      </button>
      {alertInfo.show && (
        <Alert
          variant={alertInfo.variant}
          onClose={() => setAlertInfo({ show: false })}
          dismissible
        >
          {alertInfo.message}
        </Alert>
      )}
    </div>
  );
};

export default Register;
