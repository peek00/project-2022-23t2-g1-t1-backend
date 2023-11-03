import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

import { useUserContext } from "../context/userContext";

export default function MenuDefault({firstName,lastName,email}) {
  const [role, setRole] = useState(null);
  const { userData, updateUserData } = useUserContext();

  useEffect(() => {
    // Fetch the role from localStorage or an API here
    const storedRole = JSON.parse(localStorage.getItem("permissions"));
    console.log(storedRole);
    setRole(storedRole);
    
  }, []);

  return (
    <Menu>
      <MenuHandler>
        <Button className="bg-[#1C2434]">View User Details</Button>
      </MenuHandler>
      <MenuList className="">
        {role && role.user && role.user.PUT && (
          <MenuItem>
           <Link to="/users/update" onClick={() => {
  updateUserData(firstName,lastName,email);
}}>View Accounts</Link>
          </MenuItem>
        )}
        {role && role.points && role.points.PUT && (
          <MenuItem>
            <Link to="/updatePoints" >Update User Detials</Link>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}
