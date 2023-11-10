import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

import { useUserContext } from "../../context/userContext";

export default function MenuDefault({firstName,lastName,email,id,role}) {

  const { userData, updateUserData } = useUserContext();

 

  return (
    <Menu>
      <MenuHandler>
        <Button className="bg-[#1C2434]">View User Details</Button>
      </MenuHandler>
      <MenuList className="">
        {role && role.user && role.user.PUT && (
          <MenuItem>
          <Link to ="/user/accounts/company" onClick={() => {
  updateUserData(firstName,lastName,email,id);
}}>
          View Accounts
          </Link>
           
          </MenuItem>
        )}
        {role && role.points && role.points.PUT && (
          <MenuItem>
          <Link to="/users/update" onClick={() => {
  updateUserData(firstName,lastName,email,id);
}}>Update User Details</Link>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}
