import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function SideBar() {
  const [activeLink, setActiveLink] = useState('');
  const location = useLocation();

  // Check if the current location matches a link and update the active state
  React.useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  return (
    <div className="min-h-screen w-[100%] z-50 relative">
      <div>
        <div className="flex flex-col items-center justify-center">
          <Link to="/users"><img src="/footerLogo.svg" className="h-[100px] w-[100px]" /></Link>

          <NavLink
  to="/users"
  activeClassName="active"
  className={`text-white text-sm font-thin cursor-pointer ${activeLink === '/users' ? 'active opacity-100 font-bold' : 'opacity-60'}`}
>
  View Users
</NavLink>


          <NavLink
            to="/addUser"
            activeClassName="active"
            className={`text-white text-sm font-thin hover:font-bold cursor-pointer ${activeLink === '/addUser' ? 'opacity-100 font-bold' : 'opacity-60'}`}
          >
            Enroll User
          </NavLink>

          <NavLink
            to="/logs"
            activeClassName="active"
            className={`text-white  mt-20 text-sm font-thin hover:font-bold cursor-pointer ${activeLink === '/logs' ? 'opacity-100 font-bold' : 'opacity-60'}`}
          >
            Logs
          </NavLink>
        </div>
      </div>
    </div>
  );
}
