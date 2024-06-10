import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [privateKeys, setPrivateKeys] = useState();
  const [rootKeys, setRootKeys] = useState();
  // const [user2Id, setUser2Id] = useState([]);

  return (
    <UserContext.Provider value={{ users, setUsers, privateKeys, setPrivateKeys, rootKeys, setRootKeys }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);