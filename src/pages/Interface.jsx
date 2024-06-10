import React, { useEffect } from 'react'
import {useNavigate} from 'react-router-dom';
import GetCookie from '../shared/GetCookie';
import Dashboard from '../components/Dashboard';
import { GetAllUserDetails } from '../components/GetAllUserDetails';

const Interface = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if authToken exists in cookies
    const authToken = GetCookie('authToken');
    if (!authToken) {
      // Redirect to another page (e.g., home page or dashboard)
      navigate('/');
    }
  }, [navigate]);
  return (
    <div style={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
      <Dashboard/>
      <GetAllUserDetails/>
    </div>
  )
}


export default Interface
