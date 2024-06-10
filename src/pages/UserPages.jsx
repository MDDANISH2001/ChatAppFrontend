import React from "react";
import Register from "../components/Register";
import Login from "../components/Login";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logoImage from '../assets/logo.png'
const UserPages = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[100vh] backdrop-blur-[3px] gap-4">
      <div className="text-white font-semibold text-[18px]">Welcom To!</div>
      <div className="flex items-center gap-4">
        <img src={logoImage} alt="logo" className="h-[80px]" />
        <div className="text-white text-[40px] font-semibold">Codex Chat</div>
      </div>
      <div className="text-white bg-blue-600 bg-opacity-70 font-semibold px-12 rounded-md py-1 text-[18px]">
        All Chats Are End-to-End Encrypted
      </div>
      <Tabs defaultValue="account" className="w-[40%] h-[50%] rounded-md p-1">
        <TabsList className='w-full text-center justify-evenly text-black bg-opacity-0 bg-white'>
          <TabsTrigger className='w-full text-[20px] font-[600] p-1 bg-white border-2 mx-1' value="register">Register</TabsTrigger>
          <TabsTrigger className='w-full text-[20px] font-[600] p-1 bg-white border-2 mx-1' value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="register">
          <Register />
        </TabsContent>
        <TabsContent value="login">
          <Login />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserPages;
