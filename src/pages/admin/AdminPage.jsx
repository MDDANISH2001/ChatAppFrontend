import React, { useState } from "react";
import AdminDashboard from "../../components/adminComponents/AdminDashboard";

const Interface = () => {
  const userName = "mdDanish";
  const password = "mdDanish";
  const [userNameValue, setUserNameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [adminVarified, setAdminVerified] = useState(false);

  const checkAdmin = () => {
    const verifyUserName = userNameValue === userName;
    const verifyPassword = passwordValue === password;

    setAdminVerified(verifyPassword && verifyUserName ? true : false);
  };
  return (
    <div className=" h-[100vh] backdrop-blur-sm flex justify-center items-center">
      {adminVarified ? (
        <AdminDashboard />
      ) : (
        <div className="flex flex-col items-center w-[20%] h-[20%] justify-center">
          <div className="text-[30px] text-white font-semibold">
            Admin Login
          </div>
          <input
            className="p-2 m-1 w-[90%] rounded-md font-semibold"
            onChange={(e) => setUserNameValue(e.target.value)}
            type="email"
            placeholder="Enter your Email address"
            required
          />
          <input
            className="p-2 m-1 w-[90%] rounded-md font-semibold"
            onChange={(e) => setPasswordValue(e.target.value)}
            type="password"
            placeholder="Enter Your Password"
            required
          />
          <button
            className="mt-2 font-semibold p-2 px-6 rounded-md bg-blue-600 text-white hover:bg-blue-700 duration-200"
            onClick={checkAdmin}
            type="submit"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Interface;
