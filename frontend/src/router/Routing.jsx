// Routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "../pages/LoginPage";
import LandingPage from '../pages/LandingPage';

function Routing() {
  return (
   
      <Routes>
        <Route exact path="/" element={<LandingPage/>}/>
        <Route exact path="/login" element={<Login/>}/>
       
      </Routes>
   
  );
}

export default Routing;
