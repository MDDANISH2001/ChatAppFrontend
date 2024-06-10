import React, { useEffect } from 'react'
import { useUserContext } from '../hooks/UserContext';
const baseUrl = import.meta.env.VITE_API_BASE_URL

function GetAllUserDetails() {
  const { setUsers, setPrivateKeys } = useUserContext();
  const loggedInUserEmail = sessionStorage.getItem("loggedInUserEmail");

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${baseUrl}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();

        const loggedInUserPrivateKeys = data
        .filter(keys => keys.email === loggedInUserEmail)
        .reduce((accumulator, keys) => {
          const keyPair = keys.keys.privateKey;
          return { ...accumulator, ...keyPair };
        }, {});

        const newData = data.map(user => {
          const { username, _id, email, keys } = user;
          const publicKey = keys.publicKey 
          const rootKey = keys.rootKey
        
          return {
            username,
            _id,
            email,
            publicKey,
            rootKey
          };
        });
        setPrivateKeys(loggedInUserPrivateKeys)
        setUsers(newData);
        
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (<>
    <div></div>
    </>
  )
}

export  {GetAllUserDetails}