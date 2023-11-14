import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '@/config/config';
import ErrorPage from '../pages/ErrorPage';

import { Spinner } from "@material-tailwind/react";

// Add a loader component


const PrivateRoute = ({ page, permission }) => {
  const [authorized, setAuthorized] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
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

        if(localStorage.getItem('permissions') == null){
        const response = await axios.post(API_BASE_URL + '/policy/permissions', body, {
          withCredentials: true,
        });
        localStorage.setItem('permissions', JSON.stringify(response.data));
      }


      if(localStorage.getItem('role') == null){

        const roleresponse = await axios.get(API_BASE_URL + '/auth/me', {
          withCredentials: true,
        });
        localStorage.setItem('role', JSON.stringify(roleresponse.data.role));
        localStorage.setItem('id', JSON.stringify(roleresponse.data.id));

      }
        if(localStorage.getItem('UserName') == null){
        const userDetailsResponse = await axios.get(
          API_BASE_URL + '/api/user/User/getUser?userID=' + roleresponse.data.id,
          {
            withCredentials: true,
          }
        );
        localStorage.setItem('UserName', JSON.stringify(userDetailsResponse.data.data.fullName));

        }

    
        //Set the user name
   
        // Assuming the response contains the user's role
        
        return localStorage.getItem("permissions"); // This is the role
      } catch (error) {
        if (error instanceof AxiosError) {

          // Check the message
          if (error.message === 'Request failed with status code 401') {
            // Set session expired to true
            setSessionExpired(true);
          }
        }
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

  useEffect(() => {
    if (sessionExpired) {
      // Redirect to login page
      alert('Login session expired. Please login again.');
      window.location.href = '/login';
    }
  }, [sessionExpired]);

  // Render loader if still loading
  if (loading) {
    return <Spinner className="h-10 w-10 fixed top-[50%] left-[50%]" />;
  } else if (authorized === null) {
    return null; // You can render a loading spinner or something here
  } else if (authorized) {
    return <Outlet />;
  } else {
    return <ErrorPage />;
  }
};

export default PrivateRoute;
