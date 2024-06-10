import React, { useState } from "react";
import AdminConversations from "./AdminConversations";
import AdminChatField from "./AdminChatField";

const Dashboard = () => {
  const [selectedChat, setSelectedChat] = useState({});

  const handleOpenChat = (chatName) => {
    setSelectedChat(chatName);
  };
  return (
    <div className="flex w-full h-full">
      <div className="w-[40%] border-r-2">
        <AdminConversations onOpenChat={handleOpenChat} />
      </div>
      <div className="w-[60%]">
        <AdminChatField selectedChat={selectedChat} />
      </div>
    </div>
  );
};

export default Dashboard;
