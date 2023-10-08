// Routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "../pages/LoginPage";
import LandingPage from '../pages/LandingPage';
import UserListingPage from '../pages/UserListingPage';

function Routing() {
  return (
   
      <Routes>
        <Route exact path="/" element={<LandingPage/>}/>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/users" element={<UserListingPage/>}/>
       
      </Routes>
   
  );
}

export default Routing;
