import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { API_BASE_URL } from "@/config/config";
import axios from 'axios';
import Avatar from '@mui/material/Avatar';


export default function SideBar() {
  // Profile Related
  const [settings, setSettings] = useState(false);
  const [role, setRole] = useState(null);
  const [userName, setName] = useState("");
  useEffect(() => {
    setRole(localStorage.getItem("role").replace(/[\[\]"\s]/g, ''));
    setName(localStorage.getItem("UserName").replace(/"/g, ''));
  }, []);
  const handleSettings = () => {
    setSettings(!settings);
  }
  const signOut = async () => {
    try {
      const response = await axios.get(API_BASE_URL + "/auth/logout", {
        withCredentials: true
      });
      // Clear Local Storage
      localStorage.clear();
      window.location.href = "/";
      console.log(response);
    } catch (error) {
      // Handle errors here
      console.error("Cannot log out of auth:", error);
      throw error; // Optionally re-throw the error to propagate it to the caller
    }
  };


  const [activeLink, setActiveLink] = useState("");
  const location = useLocation();

  // Check if the current location matches a link and update the active state
  React.useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  return (
    <div className="bg-[#1C2434] min-h-screen overflow-y-auto w-[10%] z-50 fixed ">
      <div className="flex flex-col ">
        <Link to="/users" className="mx-auto">
          <img src="/footerLogo.svg" className="h-[100px] w-[100px]" />
        </Link>
        <div className="my-auto text-center text-white">
          <p className="mb-3 font-bold">Welcome!</p>
          <div className="flex flex-col items-center mb-5">
            <div className="relative inline-block mb-3 text-left">
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </div>
            <p className="text-bold">{userName}</p>
            <p className="text-xs">{role}</p>
          </div>
   
    

        </div>
        {/* <CompanyDropdown selectedCompany={selectedCompany} onSelectCompany={handleCompanyChange}/> */}
        <div className="flex flex-col mx-8 ">
          <hr></hr>
          <NavLink
            to="/users"
            activeClassName="active"
            className={`mt-5 text-white text-sm py-2 px-4 rounded cursor-pointer ${activeLink === "/users"
              ? "bg-gray-500 text-black font-bold"
              : "hover:bg-blue-500 opacity-80"
              }`}
          >
            View Users
          </NavLink>
          <NavLink
            to="/users/add"
            className={`text-white text-sm py-2 px-4 mt-2 rounded cursor-pointer ${activeLink === "/users/add"
              ? "bg-gray-500 text-black font-bold"
              : "hover:bg-blue-500 opacity-80"
              }`}
          >
            Enroll User
          </NavLink>
          <NavLink
            to="/makerchecker"
            className={`text-white text-sm py-2 px-4 mt-2 rounded cursor-pointer ${activeLink === "/makerchecker"
              ? "bg-gray-500 text-black font-bold"
              : "hover:bg-blue-500 opacity-80"
              }`}
          >
            Maker Checker
          </NavLink>
          <NavLink
            to="/user/editPolicy"
            activeClassName="active"
            className={`text-white text-sm py-2 px-4 mt-2 rounded cursor-pointer ${activeLink === "/user/editPolicy"
              ? "bg-gray-500 text-black font-bold"
              : "hover:bg-blue-500 opacity-80"
              }`}
          >
            Permissions
          </NavLink>
          <NavLink
            to="/logs"
            activeClassName="active"
            className={`text-white text-sm py-2 px-4 mt-2 rounded cursor-pointer ${activeLink === "/logs"
              ? "bg-gray-500 text-black font-bold"
              : "hover:bg-blue-500 opacity-80"
              }`}
          >
            Logs
          </NavLink>

          <button
  type="submit"
  className="block w-full px-4 py-2 mt-[370%] text-sm font-semibold text-white transition duration-300 rounded bg-dark-blue hover:bg-gray-500"
  role="menuitem"
  tabIndex="-1"
  id="menu-item-3"
  onClick={signOut}
>
  Sign Out
</button>

        </div>

      </div>
      <div>
      </div>
    </div>
  );
}
