import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from 'prop-types'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const baseUrl = import.meta.env.VITE_API_BASE_URL

const Conversations = ({ onOpenChat }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${baseUrl}/admin-page/users-details`)
      .then((response) => {
        setData(response.data); // handle the response data
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, []); // Empty array as dependency ensures this effect runs only once after initial render

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex w-full h-full flex-col text-white">
      <div className="flex text-white bg-black w-full h-fit p-1 px-2 justify-between items-center">
        <div className="text-[25px]">Chat</div>

        <div className="w-full flex items-center justify-end">
          <input
            placeholder="Username"
            className="p-2 m-1 rounded-md font-semibold border border-black text-black"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
          <button className="p-1 px-2 rounded-md hover:bg-white hover:text-black duration-300">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>

      <div className="mt-2 overflow-auto">
        <div className="mt-2 overflow-auto">
          {data.map((user, user2Id) => {
            return (
              <div
                key={user2Id}
                className="flex items-center bg-white bg-opacity-20 m-1 px-4 rounded-md cursor-pointer"
                style={{ fontWeight: "400" }}
                onClick={() => {
                  onOpenChat(user);
                }}
              >
                <Avatar style={{ width: "30px", height: "30px" }}>
                  {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div
                  key={user2Id}
                  className="py-2 px-2 text-[20px]"
                  style={{ fontWeight: "400" }}
                >
                  {user.chatName}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

Conversations.propTypes = {
  onOpenChat: PropTypes.func.isRequired,
};

export default Conversations;
