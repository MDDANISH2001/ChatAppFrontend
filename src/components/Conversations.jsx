import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PropTypes, { any } from 'prop-types'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserContext } from "../hooks/UserContext";
const baseUrl = import.meta.env.VITE_API_BASE_URL

const Conversations = ({ onOpenChat }) => {
  const loggedInUserId = sessionStorage.getItem("loggedInUserId");
  const navigate = useNavigate();
  const { users } = useUserContext();
  const [emailToSearch, setEmailToSearch] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [names, setNames] = useState([]);

  const handleLogout = () => {
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };

  const handleAddUser = async () => {
    if (foundUser) {
      try {
        const response = await fetch(
          `${baseUrl}/userdata/${loggedInUserId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(foundUser),
          }
        );

        if (response.ok) {
          const data = await response.json();

          const user2Id = data.user2Data._id;

          sessionStorage.setItem("user2Id", user2Id);

          const newName = data.user2Name;

          const userExists = names.some((name) =>
            name.user2name.includes(newName)
          );

          if (userExists) {
            alert("User already exists");
          } else {
            setNames([
              ...names,
              { user2name: data.user2Name, userId: data.user2Data._id },
            ]);
          }
        } else {
          console.error(
            "Error fetching user data:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }

    setEmailToSearch("");
    setSearchResult("");
    setFoundUser(null);
  };

  useEffect(() => {
    const fetchUserNames = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/chatnames/${loggedInUserId}`
        );
        const data = await response.json();

        setNames(data);
      } catch (error) {
        console.error("Error fettching data:", error);
      }
    };

    fetchUserNames();
    handleAddUser();
  }, [loggedInUserId]);

  const handleSearchUser = async () => {
    const userFound = users.find((user) => user.email === emailToSearch);

    if (userFound) {
      setFoundUser(userFound);
      setSearchResult(`You can add ${userFound.username} to your chat`);

      try {
        const response = await fetch(`${baseUrl}/users`);

        if (response.ok) {
          const data = await response.json();

          setNames(data.names || [...names]);
        } else {
          console.error(
            "Error fetching user data:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    } else {
      setSearchResult("User not found!");
      setFoundUser(false);
    }
  };

  return (
    <div className="border-r-2 h-full relative text-white">
      <div className="w-full sticky-top flex h-fit justify-between p-2 bg-black items-center">
        <div className="text-[20px] font-semibold">Chat</div>
        <Dialog>
          <DialogTrigger>
            <button className="border py-1 px-4 border-blue-600 rounded-sm">
              ADD
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Search User</DialogTitle>
              <DialogDescription>
                Find a new user using their email!
              </DialogDescription>
            </DialogHeader>
            <div className="w-full flex items-center justify-center">
              <input
                type="email"
                className="p-2 m-1 w-[90%] rounded-md font-semibold border border-black"
                placeholder="Enter email"
                value={emailToSearch}
                onChange={(e) => setEmailToSearch(e.target.value)}
              />
            </div>
            {searchResult}
            <div className="w-full justify-center flex">
              {foundUser && (
                <button
                  className="bg-blue-600 py-1 px-4 text-white rounded-sm"
                  size="sm"
                  onClick={() => handleAddUser(foundUser)}
                >
                  Add
                </button>
              )}
            </div>
            <DialogFooter>
              <button
                className="bg-yellow-300 py-1 px-4 rounded-sm"
                onClick={handleSearchUser}
              >
                Search
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-2 overflow-auto">
        {names.map((user, user2Id) => {
          return (
            <div className="flex items-center bg-white bg-opacity-20 m-1 px-4 rounded-md cursor-pointer" onClick={() => onOpenChat(user)} key={user2Id}>
              <Avatar style={{width:'30px', height:'30px'}}>
                {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div
                key={user2Id}
                className="py-2 px-2 text-[20px]"
                action
                style={{ fontWeight: "400" }}
              >
                {user.user2name}
              </div>
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-4 z-20 right-4">
        <button
          className="bg-red-600 text-white py-2 px-4 rounded-md"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

Conversations.propTypes = {
  onOpenChat: PropTypes.shape(any).isRequired,
};

export default Conversations;
