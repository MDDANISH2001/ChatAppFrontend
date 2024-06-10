import React, { useState } from 'react'
import Conversations from './Conversations'
import ChatField from './ChatField'

const Dashboard = () => {
  const [selectedChat, setSelectedChat] = useState({});

  const handleOpenChat = (chatName) => {
    setSelectedChat(chatName);
  };
  return (
  <div className='backdrop-blur-sm w-full flex h-full columns-2'>
      <div className='w-full'>
        <Conversations onOpenChat={handleOpenChat} />
      </div>
      <div className='w-full'>
        <ChatField selectedChat = {selectedChat} />
      </div>
  </div>
  )
}

export default Dashboard
