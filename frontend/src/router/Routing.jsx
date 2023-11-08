import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import UserListingPage from '../pages/UserListingPage';
import AddUserPage from '../pages/AddUserPage';
import LogsPage from '../pages/LogsPage';
import UpdatePointsPage from '../pages/UpdatePointsPage';
import AddAccountPage from '../pages/addAccountPage';
import MakerCheckerPage from '../pages/MakerCheckerPage';
import UserAccountPage from '../pages/UserAccountPage';
import CompanyGatewayPage from '../pages/CompanyGatewayPage';




function Routing() {
  return (
    <Routes>
      
      <Route exact path='/' element={<LandingPage/>}/>
      <Route path="/login" element={<LoginPage />} />
      <Route path ="/users" element={<PrivateRoute page={"user"} permission ={"GET"}/>}>
      <Route index element={<UserListingPage/>}/>
      <Route path ="add" element={<PrivateRoute page={"user"} permission={"POST"}/>}>
      <Route index element={<AddUserPage type="add" />}/></Route>
      <Route path ="update" element={<PrivateRoute page ={"user"} permission={"PUT"}/>}>
      <Route index element={<AddUserPage type="update" />}/>
      </Route>
      

      </Route>
   
      
      
      <Route path ="/logs" element={<PrivateRoute page={"logging"} permission={"GET"}/>}>
        <Route path ="/logs" element={<LogsPage />}  />
      </Route>
      <Route path ="/updatePoints" element={<PrivateRoute page={"points"} permission={"PUT"}/>}>
      <Route path ="/updatePoints" element={<UpdatePointsPage/>}/>
      </Route>
      <Route path ="/addAccount" element={<AddAccountPage/>}  />


      <Route path ="/makerchecker" element={<MakerCheckerPage/>}  />

      <Route path="/user/accounts" element={<UserAccountPage/>}/>
      <Route path ="/user/accounts/company" element ={<CompanyGatewayPage/>}/>

      


     
    </Routes>
  );
}

export default Routing;