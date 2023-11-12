import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AlertIcon from '../components/common_utils/AlertIcon';
import axios from 'axios';
import { API_BASE_URL } from '@/config/config';
import ErrorPage from '../pages/Errorpage';
import { Spinner } from "@material-tailwind/react";

// Add a loader component


const PrivateRoute = ({ page, permission }) => {
  const [authorized, setAuthorized] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchRole = async () => {
      const body = {
        pageLs: [
          'user',
          'points',
          'maker-checker',
          'policy',
          'logging',
          'user/User/getAllUsersPaged?isAdmin=True',
          'user/User/getAllUsersPaged?isAdmin=False',
        ],
      };
      try {
        const response = await axios.post(API_BASE_URL + '/policy/permissions', body, {
          withCredentials: true,
        });

        console.log(response.data);

        const roleresponse = await axios.get(API_BASE_URL + '/auth/me', {
          withCredentials: true,
        });

        const userDetailsResponse = await axios.get(
          API_BASE_URL + '/api/user/User/getUser?userID=' + roleresponse.data.id,
          {
            withCredentials: true,
          }
        );

        localStorage.setItem('role', JSON.stringify(roleresponse.data.role));
        localStorage.setItem('id', JSON.stringify(roleresponse.data.id));
        //Set the user name
        localStorage.setItem('UserName', JSON.stringify(userDetailsResponse.data.data.fullName));
        // Assuming the response contains the user's role
        localStorage.setItem('permissions', JSON.stringify(response.data));
        console.log(localStorage.getItem('permissions'));
        return response.data; // This is the role
      } catch (error) {
        // Handle errors here
        console.error('Error fetching role:', error);
        throw error;
      }
    };

    fetchRole()
      .then((role) => {
        // Check if the user is authorized to access the page
        console.log(role);

        if (page == 'user' && permission == 'GET') {
          const isAdmin = role['user/User/getAllUsersPaged?isAdmin=True']['GET'];
          console.log(isAdmin);
          const isUser = role['user/User/getAllUsersPaged?isAdmin=False']['GET'];
          console.log(isUser);

          if (isAdmin || isUser) {
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
        } else if (role[page][permission]) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      })
      .catch((error) => {
        // Handle errors
        console.error('Authorization check error:', error);
        setAuthorized(false);
      })
      .finally(() => {
        // Set loading to false when the fetch is complete
        setLoading(false);
      });
  }, [page]);

  // Render loader if still loading
  if (loading) {
    return <Spinner className="h-10 w-10" />;
  } else if (authorized === null) {
    return null; // You can render a loading spinner or something here
  } else if (authorized) {
    return <Outlet />;
  } else {
    return <ErrorPage />;
  }
};

export default PrivateRoute;
