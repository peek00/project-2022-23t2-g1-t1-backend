import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AlertIcon from '../components/AlertIcon';
import axios from 'axios';

const PrivateRoute = ({ page }) => {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const body = { "pageLs": ["user", "points", "maker-checker", "policy", "logging"] };
      try {
        const response = await axios.post("http://localhost:8000/policy/permissions", body, {
          withCredentials: true
        });

        // Assuming the response contains the user's role
        localStorage.setItem("permissions", JSON.stringify(response.data));
        return response.data; // This is the role
      } catch (error) {
        // Handle errors here
        console.error("Error fetching role:", error);
        throw error;
      }
    };

    fetchRole()
      .then((role) => {
        // Check if the user is authorized to access the page
        if (role[page]['GET']) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      })
      .catch((error) => {
        // Handle errors
        console.error("Authorization check error:", error);
        setAuthorized(false);
      });
  }, [page]);

  if (authorized === null) {
    return null; // You can render a loading spinner or something here
  } else if (authorized) {
    return <Outlet />;
  } else {
    return <AlertIcon message="You are not authorized to access this page." />;
  }
};

export default PrivateRoute;
