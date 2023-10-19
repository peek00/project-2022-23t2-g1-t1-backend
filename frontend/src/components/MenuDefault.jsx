import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button,
  } from "@material-tailwind/react";

  import { Link } from "react-router-dom";
   
  export  default function MenuDefault() {
    return (
      <Menu >
        <MenuHandler>
         
          <Button className="bg-[#1C2434]">Edit User
          </Button>
        </MenuHandler>
        <MenuList className="">
          <MenuItem><Link to="/updateUser">Edit User Details</Link></MenuItem>
          <MenuItem><Link to="/updatePoints">Update User Points</Link></MenuItem>
          
        </MenuList>
      </Menu>
    );
  }