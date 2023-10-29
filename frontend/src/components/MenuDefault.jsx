import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

export default function MenuDefault() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Fetch the role from localStorage or an API here
    const storedRole = JSON.parse(localStorage.getItem("permissions"));
    console.log(storedRole);
    
  }, []);

  return (
    <Menu>
      <MenuHandler>
        <Button className="bg-[#1C2434]">Edit User</Button>
      </MenuHandler>
      <MenuList className="">
        {role && role.user && role.user.PUT && (
          <MenuItem>
            <Link to="/users/update">Edit User Details</Link>
          </MenuItem>
        )}
        {role && role.points && role.points.PUT && (
          <MenuItem>
            <Link to="/updatePoints">Update User Points</Link>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}
