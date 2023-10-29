import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AlertIcon from '../components/AlertIcon';
import axios from 'axios';



const fetchRole = async () => {
  try {
    const response = await axios.get("http://localhost:8000/auth/me", {
      withCredentials: true
    });

    // Assuming the response contains the user's role
    var role = response.data.role;
     role = "Owner";
    // 
    return role;
  } catch (error) {
    // Handle errors here
    console.error("Error fetching role:", error);
    throw error; // Optionally re-throw the error to propagate it to the caller
  }
};

const PrivateRoute = ({ roles }) => {
  const [userRole, setUserRole] = useState(null);
  console.log(roles);

  useEffect(() => {
    fetchRole().then((role) => {
      setUserRole(role);
      localStorage.setItem("role",role);
    });
  }, []);

  
  

  if (roles.includes(userRole)) {
    
    return <Outlet />;
  } else {
    // Render the error message component when the user doesn't have the required role
    return <AlertIcon message="You are not authorized to access this page." />;
  }
};

export default PrivateRoute;
