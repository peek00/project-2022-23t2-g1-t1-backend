import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import UserListingPage from '../pages/UserListingPage';
import AddUserPage from '../pages/AddUserPage';
import LogsPage from '../pages/LogsPage';
import UpdatePointsPage from '../pages/UpdatePointsPage';

function Routing() {
  return (
    <Routes>
      
          <Route exact path='/' element={<LandingPage/>}/>
      <Route path="/login" element={<LoginPage />} />
      <Route path ="/users" element={<PrivateRoute/>}/>
      <Route path ="/users" element={<UserListingPage/>}/>
      <Route path ="/addUser" element={<PrivateRoute/>}/>
      <Route path ="/addUsers=" element={<AddUserPage type="add" />}/>
      <Route path ="/updateUser" element={<PrivateRoute/>}/>
      <Route path ="/updateUser=" element={<AddUserPage type="update" />}/>
      <Route path ="/logs" element={<PrivateRoute/>}/>
      <Route path ="/logs" element={<LogsPage />}  />
      <Route path ="/updatePoints" element={<PrivateRoute/>}/>
      <Route path ="/updatePoints" element={<UpdatePointsPage/>}/>



     
    </Routes>
  );
}

export default Routing;
