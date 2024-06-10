import React, { useEffect, useState } from "react";
import axios from "axios";
import getKeysFromConversation from "../../shared/getUserKeys";
import decryptMessage from "../../shared/decryptKey";
import { deriveSessionKey } from "../../shared/generateSessionKey";
import { decryptDataWithSessionKey } from "../../shared/encryptDecrypt";
import io from "socket.io-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PropTypes from "prop-types";
const baseUrl = import.meta.env.VITE_API_BASE_URL

const socket = io.connect(`${baseUrl}`);
//
function ChatField({ selectedChat }) {

  const [chatMessages, setChatMessages] = useState(null);
  const [data, setData] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomId, setRoomId] = useState("");

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

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${baseUrl}/admin-page/geting-user-details`)
        .then((response) => {
          setData(response.data); // handle the response data
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    };
    fetchData();
  }, []); // Empty array as dependency ensures this effect runs only once after initial render

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${baseUrl}/admin-page/conversation-chat`)
        .then((response) => {
          setConversation(response.data); // handle the response data
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    };
    fetchData();
  }, []); // Empty array as dependency ensures this effect runs only once after initial render

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedChat) {
        return;
      }

      setRoomId(selectedChat.chatIds);
      const messages = conversation
        ?.map((message) => {
          return selectedChat.chatIds === message.conversationIds
            ? message.sharedInfo
            : "null";
        })
        .filter((id) => id !== "null")
        .flat();
      const bothUserData = selectedChat
        ? getKeysFromConversation(data, selectedChat)
        : null;

      const tempCredentialA =
        "liame" + bothUserData.user1Email + "innovation is our passion";
      const tempCredentialB =
        "liame" + bothUserData.user2Email + "innovation is our passion";

      const credentialForPrivateKeyA = tempCredentialA.slice(0, 32);
      const credentialForRootKeyA = tempCredentialA.slice(5, 37);

      const credentialForPrivateKeyB = tempCredentialB.slice(0, 32);
      const credentialForRootKeyB = tempCredentialB.slice(5, 37);

      const publicKeyA = bothUserData.user1Keys.publicKey;
      const privateKeyA = await decryptMessage(
        bothUserData.user1Keys.privateKey,
        credentialForPrivateKeyA
      );
      const rootKeyA = await decryptMessage(
        bothUserData.user1Keys.rootKey,
        credentialForRootKeyA
      );

      const publicKeyB = bothUserData.user2Keys.publicKey;
      const privateKeyB = await decryptMessage(
        bothUserData.user2Keys.privateKey,
        credentialForPrivateKeyB
      );
      const rootKeyB = await decryptMessage(
        bothUserData.user2Keys.rootKey,
        credentialForRootKeyB
      );

      const rootKey = rootKeyA.slice(0, 32) + rootKeyB.slice(32);

      const userAKeyPairs = await deriveSessionKey(
        privateKeyA,
        publicKeyB,
        rootKey,
        publicKeyA
      );
      const serverSessionKeyA = userAKeyPairs.serverSessionKey;

      const userBKeyPairs = await deriveSessionKey(
        privateKeyB,
        publicKeyA,
        rootKey,
        publicKeyB
      );

      const serverSessionKeyB = userBKeyPairs.serverSessionKey;

      const splitIds = selectedChat.chatIds.split("/");
      const splitName = selectedChat.chatName.split("/");

      const decryptedMessages = messages?.map((message) => {
        const decryptedMessage =
          splitIds[0] === message.messagedUserId
            ? decryptDataWithSessionKey(message.message, serverSessionKeyA)
            : decryptDataWithSessionKey(message.message, serverSessionKeyB);

        const userName =
          splitIds[0] === message.messagedUserId ? splitName[0] : splitName[1];

        return { message: decryptedMessage, messagedUserId: userName };
      });

      setChatMessages(decryptedMessages);
    };
    fetchData();

    socket.on("receive_message", (data) => {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          message: data,
        },
      ]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [selectedChat, conversation, data]); // Empty array as dependency ensures this effect runs only once after initial render

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex w-full h-full flex-col">
      <div className="bg-black text-white text-[25px] flex items-center py-2 px-2 gap-2">
        <Avatar style={{ width: "30px", height: "30px" }}>
          {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        {selectedChat?.chatName}
      </div>
      <div className="h-full flex p-2 overflow-auto">
        {selectedChat ? (
          <div className=" w-full h-fit">
            {chatMessages?.length > 0 ? (
              <div className="flex flex-col w-full justify-end overflow-auto h-fit">
                {chatMessages?.map((message, index) => {
                  return (
                    <div
                      key={index}
                      className="align-self-end mt-1 p-3"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        fontWeight: "400",
                        borderRadius: "10px 10px 0px 10px",
                        backgroundColor: "skyblue",
                        lineHeight: 0.6,
                      }}
                    >
                      <span>{message.message}</span>
                      <br />
                      <span
                        style={{
                          textAlign: "right",
                          fontSize: "small", 
                          color: "blue"
                        }}
                      >
                        {message.messagedUserId}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center items-center text-white font-semibold w-full">
                <div>There are no messages of this chat for now!</div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center text-white font-semibold w-full">
            Select a chat
          </div>
        )}
      </div>
    </div>
  );
}

ChatField.propTypes = {
  selectedChat: PropTypes.shape({
    userId: PropTypes.string,
    user2name: PropTypes.string,
    chatIds: PropTypes.string,
    chatName: PropTypes.string,
  }).isRequired,
};


export default ChatField;
