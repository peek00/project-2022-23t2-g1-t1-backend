import React, { useState,useEffect } from 'react';
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import {API_BASE_URL} from "@/config/config";

function PolicyTable() {

  const [currentRoles,setCurrentRoles] = useState({});
  const [selectedRoles, setSelectedRoles] = useState({});
  const [roles, setRoles] = useState([]);
  // const roles = ['Owner', 'Manager', 'Engineer', 'Product Manager'];  
  const policyMapping = {
    "View Users": ["/api/user/User/getAllUsersPaged?isAdmin=False","GET"],
    "View Admin Users": ["/api/user/User/getAllUsersPaged?isAdmin=True","GET"],
    "Add Users" :["/api/user" ,"POST"],
    "Edit User Details" :["/api/user" ,"PUT"],
    "Delete Users" :["/api/user" ,"DELETE"],
    "Update Points" :["/api/point" ,"PUT"],
    "View Account Points":["/api/point","GET"],
    "Read Logging Information":["/api/logging","GET"],
    "Edit Permissions of Users" :["/policy","PUT"]
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data")
        const response = await axios.get(API_BASE_URL+'/policy',{withCredentials: true});
        const roleResponse = await axios.get(API_BASE_URL+'/api/user/Role/getAllRoles',{withCredentials: true});
        if (roleResponse.data.data.length > 0){
          let roleLs = [];
          roleResponse.data.data.forEach(r => {
            roleLs.push(r.roleName);
          })
          roleLs = roleLs.filter(role => role !== "User").sort(role => role === "Owner" ? -1 : 1);
          setRoles(roleLs);
        }
        setCurrentRoles(response.data);
        
      } catch (error) {
        console.log(error);
      }
    };
    fetchData(); // Call the fetchData function
  }, []); 

  useEffect(() => {
    if (Object.keys(currentRoles).length === 0) return;
    let newMapping = Object.keys(policyMapping).reduce((acc, action) => {
      acc[action] = {};
      
      roles.forEach(role => {
        console.log(role);
        console.log(acc);
        const url =policyMapping[action][0];
        
        const method = policyMapping[action][1];
        console.log(currentRoles);
        console.log(url);
        console.log(method);
        if (currentRoles[url][method].includes(role)){
          acc[action][role] = true;
        }
        else{
          acc[action][role] = false;
        }
      });
      return acc;
    }, {});
    setSelectedRoles(newMapping);
  }, [currentRoles]);

  const handleCheckboxChange = (action, role) => {
    setSelectedRoles(prevRoles => ({
      ...prevRoles,
      [action]: {
        ...prevRoles[action],
        [role]: !prevRoles[action][role]
      }
    }));
  };

  const updatePolicy = async () => {
    // First Iterate through the list and then check if the value is true or false
    for (const endpoint in selectedRoles){
      var newPermission ={}
      var roleList = [];
      
      const api = policyMapping[endpoint][0];
      const method = policyMapping[endpoint][1];
      newPermission["endpoint"] = api;
      for (const role in selectedRoles[endpoint]){
        if(selectedRoles[endpoint][role]){
          roleList.push(role);
        }
      }

      newPermission[method] = roleList;
      console.log(newPermission);

      try {
        const response = await axios.put(API_BASE_URL+"/policy", newPermission, { withCredentials: true });
        console.log(response);
      } catch (error) {
        console.error("Error making PUT request:", error);
      }
    }
    alert('The permissions has been updated');
  }

  const colStyle = {
      outline: '1px solid black', 
      backgroundColor: '#1C2434',
      color:'white'
  };
  
  const selectStyle = {
      textAlign: 'center'
  };

  const actionStyle = {
      textAlign: 'center',
      outline: '1px solid black'
  };
  
  const rowStyle={
      outline: '1px solid black'
  }
  
  const tableStyle={
      width: '100%'
  }

  return (
    <Container className='mt-10'>
        <Table size="lg" style={tableStyle} className="p-5">
            <thead>
                <tr>
                    <th rowSpan={2} style={{...colStyle, padding: '10px'}}>Policies</th>
                    <th colSpan={4} style={{...colStyle, padding: '10px'}}>Roles</th>     
                </tr>
                <tr>
                {roles.map(role => (
                    <th key={role} style={{ ...colStyle, padding: '20px' }}>{role.charAt(0).toUpperCase() + role.slice(1)}</th>
                ))}     
                </tr>
            </thead>
            <tbody>
                {Object.keys(selectedRoles).length && Object.keys(policyMapping).map(action => (
                    <tr key={action} style={rowStyle}>
                        <td style={{ ...actionStyle, padding: '20px' }}>{action}</td>
                        {roles.map(role => (
                        <td key={role} style={{ ...selectStyle, padding: '20px' }}>
                            <input
                            type="checkbox"
                            checked={selectedRoles[action][role]}
                            onChange={() => handleCheckboxChange(action, role)}
                            />
                        </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>
        <div className='text-center w-full'>
            <button type="button"  onClick ={updatePolicy} class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-10 ">Submit Policy</button>
            </div>
        
    </Container>
  );
}

export default PolicyTable;