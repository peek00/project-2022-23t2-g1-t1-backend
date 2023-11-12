import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import UserListingPage from '../pages/UserListingPage';
import AddUserPage from '../pages/AddUserPage';
import LogsPage from '../pages/LogsPage';
import UpdatePointsPage from '../pages/UpdatePointsPage';
import AddAccountPage from '../pages/AddAccountPage';
import MakerCheckerPage from '../pages/MakerCheckerPage';
import UserAccountPage from '../pages/UserAccountPage';
import CompanyGatewayPage from '../pages/CompanyGatewayPage';
import EditPolicyPage from '../pages/EditPolicyPage';
import EditMakerCheckerPage from '../pages/EditMakerCheckerPage';

function Routing() {
  return (
    <Routes>

      <Route path="/" element={<LandingPage />} />

      <Route
        path="/user/editPolicy"
        element={<PrivateRoute page={"policy"} permission={"GET"} />}>
<Route path="/user/editPolicy" element={<EditPolicyPage />} />
      </Route>
   
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/users"
        element={<PrivateRoute page={"user"} permission={"GET"} />}
      >
        <Route index element={<UserListingPage />} />
        <Route
          path="add"
          element={<PrivateRoute page={"user"} permission={"POST"} />}
        >
          <Route index element={<AddUserPage type="add" />} />
        </Route>
        <Route
          path="update"
          element={<PrivateRoute page={"user"} permission={"PUT"} />}
        >
          <Route index element={<AddUserPage type="update" />} />
        </Route>
      </Route>

      <Route
        path="/logs"
        element={<PrivateRoute page={"logging"} permission={"GET"} />}
      >
        <Route path="" element={<LogsPage />} />
      </Route>
  
        <Route path="updateAccount" element={<UpdatePointsPage />} />
     
        <Route path="addAccount" element={<AddAccountPage />} />


      <Route
        path="/makerchecker"
        element={<PrivateRoute page={"maker-checker"} permission={"GET"} />}
      >
        <Route index element={<MakerCheckerPage />} />
     
      
        <Route path="edit" element={<EditMakerCheckerPage />} />
      </Route>
      <Route
        path="/user/account/company"
        // element={<PrivateRoute page={"points"} permission={"GET"} />}
      >
        <Route index element={<CompanyGatewayPage />} />
        <Route path=":companyId" element={<UserAccountPage />} />
        
        <Route path=":companyId/:userId/editPoints" element={<UpdatePointsPage />} />
     
        <Route path=":userId/addPoints" element={<AddAccountPage />} />
      </Route>
    </Routes>
  );
}

export default Routing;