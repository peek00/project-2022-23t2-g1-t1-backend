import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import the Cookies library

const PrivateRoute = () => {
  const hasValidJWT = !!Cookies.get('jwt');
  
  // Determine if authorized, from context or however you're doing it
  // If authorized, return an outlet that will render child elements
  // If not, return an element that will navigate to the login page

  return hasValidJWT ? <Outlet /> : <Navigate to="/login" exact />;
}

export default PrivateRoute;
