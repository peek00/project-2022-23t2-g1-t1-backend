import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import CompanyDropdown from "../account/CompanyDropdown";

export default function SideBar() {
  const [activeLink, setActiveLink] = useState('');
  const location = useLocation();

  // Check if the current location matches a link and update the active state
  React.useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  // Handle selected company.
  const [selectedCompany, setSelectedCompany] = useState();
  const handleCompanyChange = (newState) => {
    setSelectedCompany(newState);
  };

  return (
    <div className="bg-[#1C2434] h-screen  overflow-y-auto w-[20%] z-50 fixed">
      <div className="flex flex-col items-center justify-center">
        <Link to="/users">
          <img src="/footerLogo.svg" className="h-[100px] w-[100px]" />
        </Link>
        
        <CompanyDropdown selectedCompany={selectedCompany} onSelectCompany={handleCompanyChange}/>

        <NavLink
          to="/users"
          activeClassName="active"
          className={`text-white text-sm font-thin cursor-pointer ${
            activeLink === '/users' ? 'active opacity-100 font-bold' : 'opacity-60'
          }`}
        >
          View Users
        </NavLink>

        <NavLink
          to="/users/add"
          activeClassName="active"
          className={`text-white text-sm font-thin hover:font-bold cursor-pointer ${
            activeLink === '/users/add' ? 'opacity-100 font-bold' : 'opacity-60'
          }`}
        >
          Enroll User
        </NavLink>

        <NavLink
          to="/user/editPolicy"
          activeClassName="active"
          className={`text-white mt-5 text-sm font-thin hover:font-bold cursor-pointer ${
            activeLink === '/user/editPolicy' ? 'opacity-100 font-bold' : 'opacity-60'
          }`}
        >
          Permissions
        </NavLink>

        <NavLink
          to="/logs"
          activeClassName="active"
          className={`text-white mt-5 text-sm font-thin hover:font-bold cursor-pointer ${
            activeLink === '/logs' ? 'opacity-100 font-bold' : 'opacity-60'
          }`}
        >
          Logs
        </NavLink>
      </div>
    </div>
  );
}
