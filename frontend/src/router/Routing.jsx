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
      <Route path ="/users" element={<PrivateRoute page={"user"} permission ={"GET"}/>}>
      <Route path ="/users" element={<UserListingPage/>}/>
      </Route>
   
      <Route path ="/addUser" element={<PrivateRoute page={"user"} permission={"POST"}/>}>
      <Route path ="/addUsers=" element={<AddUserPage type="add" />}/>
      </Route>
      <Route path ="/updateUser" element={<PrivateRoute page ={"user"} permission={"PUT"}/>}>
      <Route path ="/updateUser=" element={<AddUserPage type="update" />}/>
      </Route>
      <Route path ="/logs" element={<PrivateRoute page={"logging"} permission={"GET"}/>}>
      <Route path ="/logs" element={<LogsPage />}  />
      </Route>
      <Route path ="/updatePoints" element={<PrivateRoute page={"points"} permission={"PUT"}/>}>
      <Route path ="/updatePoints" element={<UpdatePointsPage/>}/>
      </Route>



     
    </Routes>
  );
}

export default Routing;