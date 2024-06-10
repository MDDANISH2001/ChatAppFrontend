import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import GetCookie from "../shared/GetCookie";
const baseUrl = import.meta.env.VITE_API_BASE_URL

const Login = () => {
  const navigate = useNavigate();

  const [alertInfo, setAlertInfo] = useState({
    show: false,
    variant: "success",
    message: "",
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const authToken = GetCookie("authToken");
    if (authToken) {
      navigate("/chatpage");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { authToken, userId, email } = await response.json();

        sessionStorage.setItem("loggedInUserId", userId);
        sessionStorage.setItem("loggedInUserEmail", email);

        document.cookie = `authToken=${authToken}; SameSite=Lax; Path=/`;

        setAlertInfo({
          show: true,
          variant: "success",
          message: "User Loggedin!",
        });

        navigate("/chatpage");
      } else {
        setAlertInfo({
          show: true,
          variant: "danger",
          message: "Problem in Login",
        });
      }
      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("Error:", error);
      setAlertInfo({
        show: true,
        variant: "danger",
        message: "An error occurred during Login",
      });
      setFormData({
        email: "",
        password: "",
      });
    }
  };
  return (
      <div className="flex flex-col items-center">
          <input
            className="p-2 m-1 w-[90%] rounded-md font-semibold"
            value={formData.email}
            onChange={handleInputChange}
            type="text"
            name="email"
            id="email"
            placeholder="Enter your Email address"
            required
          />
          <input
            className="p-2 m-1 w-[90%] rounded-md font-semibold"
            value={formData.password}
            onChange={handleInputChange}
            type="password"
            name="password"
            id="password"
            placeholder="Enter Your Password"
            required
          />
        <button className="mt-2 font-semibold p-2 px-6 rounded-md bg-blue-600 text-white hover:bg-blue-700 duration-200" onClick={handleRegister} type="submit">
          Login
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

export default Login;
