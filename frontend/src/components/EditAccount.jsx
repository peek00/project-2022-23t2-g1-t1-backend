import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";

export default function EditAccount({companyId, pointsId, points}) {
  const [role, setRole] = useState(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Fetch the role from localStorage or an API here
    const storedRole = JSON.parse(localStorage.getItem("permissions"));
    console.log(storedRole);
    setRole(storedRole);
    
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClickInsideMenu = (event) => {
    event.stopPropagation(); // Prevent the event from bubbling up
  }

  return (
    <Menu>
      <MenuHandler>
        <Button className="bg-[#1C2434]">Edit Points</Button>
      </MenuHandler>
      <MenuList className="">
        {role && role.user && role.user.PUT && (
          <MenuItem>
              <input 
                  type="number" 
                  className="w-full border rounded p-2"
                  placeholder={points}
                  value={inputValue}
                  onChange={handleInputChange}
                  onClick={handleClickInsideMenu}
              />
            </MenuItem>
         )}
         {role && role.user && role.user.PUT && (
            <MenuItem>
              <Button
                  className="bg-[#1C2434]"
                  onClick={() => {
                      axios.put("http://localhost:8000/api/points/updatebalance", 
                      {
                          company_id: companyId,
                          balance: pointsId,
                          user_id: points
                      },
                      {
                          withCredentials: true
                      })
                      .then((response) => {
                          console.log(response.data);
                      })
                      .catch((error) => {
                          console.error('Error fetching data:', error);
                      });
                  }}
              >
                  Submit
              </Button>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}