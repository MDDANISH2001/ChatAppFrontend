import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useUserContext } from "../hooks/UserContext";
import {
  decryptDataWithSessionKey,
  encryptDataWithSessionKey,
} from "../shared/encryptDecrypt";
import fetchAndDeriveKeys from "../shared/deriveKeys.js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PropTypes from "prop-types";

const baseUrl = import.meta.env.VITE_API_BASE_URL
const socket = io.connect(`${baseUrl}`);

function ChatField({ selectedChat }) {
  const loggedInUserId = sessionStorage.getItem("loggedInUserId");
  const addedUserId = selectedChat.userId;

  const { privateKeys, users } = useUserContext();
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [rawData, setRawData] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    if (roomId) {
      socket.emit("join_room", roomId, (acknowledgment) => {
        if (acknowledgment) {
          console.log(`Joined room`);
        } else {
          console.error(`Failed to join room`);
        }
      });
    }
  }, [roomId]);

  const [formData, setFormData] = useState({
    message: "",
    messagedUserId: loggedInUserId,
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      messagedUserId: loggedInUserId,
    });
  };

  const handleSendMessage = async () => {
    const chekMessage = formData.message.trim();
    if (!chekMessage) {
      return;
      }
    
    const message = formData.message;

    const sessionKey = await fetchAndDeriveKeys(
      loggedInUserId,
      addedUserId,
      privateKeys,
      users,
      roomId ? roomId : rawData.conversationIds
      );

    if (!sessionKey) {
      console.error("Recipient's public key not found.");
      return;
    }

    const encryptedMessage = encryptDataWithSessionKey(
      message,
      sessionKey.serverSessionKey
    );

    socket.emit("send_message", {
      message,
      encryptedMessage,
      roomId : roomId || rawData.conversationIds,
      addedUserId,
      senderId: formData.messagedUserId,
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        message: formData.message,
        messagedUserId: loggedInUserId,
        encrypted: true,
      },
    ]);

    setFormData({
      message: "",
    });
    setRoomId(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/shareddata/${loggedInUserId}/${addedUserId}`
        );
        const data = await response.json();
        setRawData(data)
        const conversationId = data.conversationIds;
        setRoomId(conversationId);
        const messages = data.sharedInfo;

        const sessionKey = await fetchAndDeriveKeys(
          loggedInUserId,
          addedUserId,
          privateKeys,
          users,
          conversationId
        );

        const decryptedMessages = messages.map((message) => {
          const encryptedMessage = message.message;

          const encMessageToStore =
            message.messagedUserId === loggedInUserId
              ? decryptDataWithSessionKey(
                  encryptedMessage,
                  sessionKey.serverSessionKey
                )
              : decryptDataWithSessionKey(
                  encryptedMessage,
                  sessionKey.clientSessionKey
                );
          try {
            const decryptedMessage = {
              message: encMessageToStore,
              messagedUserId: message.messagedUserId,
              _id: message._id,
            };
            return decryptedMessage;
          } catch (error) {
            console.error("Error decrypting message:", error);
            console.error("Encrypted message:", encryptedMessage);
            // Handle the error as needed, e.g., return the original message
            return {
              message: "No message received",
              messagedUserId: message.messagedUserId,
              _id: message._id,
            };
          }
        });
        setMessages(decryptedMessages);
      } catch (error) {
        console.error("Error fettching data:", error);
      }
    };

    fetchData();

    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: data,
        },
      ]);
    });

    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    return () => {
      socket.off("receive_message");
    };
  }, [loggedInUserId, addedUserId, privateKeys, users]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex w-full h-full flex-col">
      {selectedChat.user2name && (
        <div className="bg-black text-white text-[25px] flex items-center py-1 px-2 gap-2">
          <Avatar style={{ width: "30px", height: "30px" }}>
            {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {selectedChat.user2name}
        </div>
      )}
      <div className="h-full flex px-2 overflow-auto " ref={containerRef}>
        {messages?.length > 0 ? (
          <div className="flex flex-col w-full justify-end h-fit">
            {messages.map((message, index) => {
              const getId = message.messagedUserId;
              const compare = getId === loggedInUserId;
              return (
                <div
                  key={index}
                  className={`${compare ? "justify-end" : "items-start"} flex `}
                >
                  <div
                    className={`mt-1 w-fit p-2 ${
                      compare ? "justify-end items-end" : "items-start"
                    }`}
                    style={{
                      fontWeight: "400",
                      borderRadius: compare
                        ? "10px 10px 0px 10px"
                        : "10px 10px 10px 0px",
                      backgroundColor: compare ? "skyblue" : "lightgrey",
                    }}
                  >
                    {message.message}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center text-white font-semibold w-full">
            {selectedChat ? (
              <div>Select the Name to continue Chat</div>
            ) : (
              <div>There are no messages in {selectedChat.userId}</div>
            )}
          </div>
        )}
      </div>
      <div className="text-white w-full text-center text-[11px]">All chats are 256-bit encrypted</div>
      <div className="flex justify-center items-center">
        <input
          type="text"
          className="p-2 m-1 w-[90%] rounded-md font-semibold border border-black"
          value={formData.message}
          disabled={selectedChat.user2name ? false : true}
          onChange={handleInputChange}
          placeholder="Type your Message here"
          id="message"
          name="message"
        />
        <button
          disabled={selectedChat.user2name ? false : true}
          className="bg-blue-600 py-1 px-4 text-white rounded-sm"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

ChatField.propTypes = {
  selectedChat: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    user2name: PropTypes.string,
  }).isRequired,
};

export default ChatField;
