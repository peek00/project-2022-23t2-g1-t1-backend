// Routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "../pages/Login";

function Routing() {
  return (
   
      <Routes>
        <Route exact path="/" element={<Login/>}/>
       
      </Routes>
   
  );
}

export default Routing;
