import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button,
  } from "@material-tailwind/react";
   
  export  default function MenuDefault() {
    return (
      <Menu >
        <MenuHandler>
          <Button className="bg-[#1C2434]">Edit User
          </Button>
        </MenuHandler>
        <MenuList className="">
          <MenuItem>Menu Item 1</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          <MenuItem>Menu Item 3</MenuItem>
        </MenuList>
      </Menu>
    );
  }