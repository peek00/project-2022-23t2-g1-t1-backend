import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AlertIcon from '../components/common_utils/AlertIcon';
import axios from 'axios';
import {API_BASE_URL} from "@/config/config";

const PrivateRoute = ({ page,permission }) => {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const body = { "pageLs": ["user", "points", "maker-checker", "policy", "logging"] };
      try {
        const response = await axios.post(API_BASE_URL+'/policy/permissions', body, {
          withCredentials: true
        });

        const roleresponse = await axios.get(API_BASE_URL+"/auth/me", {
          withCredentials: true
        });

        const userDetailsResponse = await axios.get(API_BASE_URL+"/api/user/User/getUser?userID=" + roleresponse.data.id, {
          withCredentials: true
        });
        console.log(userDetailsResponse.data)

        localStorage.setItem("role", JSON.stringify(roleresponse.data.role));
        localStorage.setItem("id", JSON.stringify(roleresponse.data.id));
        //Set the user name 
        localStorage.setItem("UserName",JSON.stringify(userDetailsResponse.data.data.fullName))
        // Assuming the response contains the user's role
        localStorage.setItem("permissions", JSON.stringify(response.data));
        console.log(localStorage.getItem("permissions"));
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
        console.log(role);
        if (role[page][permission]) {
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
