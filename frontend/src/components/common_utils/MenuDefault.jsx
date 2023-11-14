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
import { deleteUser } from "../../apis/users";

export default function MenuDefault({firstName,lastName,email,id,role}) {

  const { userData, updateUserData } = useUserContext();


  const handleDelete = async (e,userId) => {
    e.preventDefault();
     console.log("Deleting user with ID:", userId);

    try {
      // Assuming deleteUser is an asynchronous function that deletes the user
      await deleteUser(userId);
      window.location.href = "/users";
      // Optionally, you can update the user context or perform other actions after deletion
      // updateUserData(null, null, null, null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  

 

  return (
    <Menu>
      <MenuHandler>
        <Button className="bg-[#1C2434]">View User Details</Button>
      </MenuHandler>
      <MenuList className="">
        {role && role.user && role.user.PUT && (
          <MenuItem>
          <Link to ={`/user/account/${id}`} onClick={() => {
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
      <MenuItem>
  <button onClick={(e) => handleDelete(e, id)}>
    Delete User
  </button>
</MenuItem>
      </MenuList>
    </Menu>
  );
}
