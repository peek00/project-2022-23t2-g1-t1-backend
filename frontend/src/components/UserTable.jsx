import { useEffect, useState,useContext } from "react";
import MenuDefault from "./MenuDefault.jsx";
import axios from "axios";


export default function UserTable() {
    const [users, setUsers] = useState([]);

    



   
    



    

    



    useEffect(() => {
      viewUser();
    }, []);

    const viewUser = async () => {
      // First check user permissions to access ?isAdmin=True
      try {
        const viewUserPermissions = await axios.post("http://localhost:8000/policy/permissions", {
          pageLs: ["user/User/getAllUsers?isAdmin=True"],
        }, {
          withCredentials: true
        });
        const canViewAdmin = viewUserPermissions.data["user/User/getAllUsers?isAdmin=True"].GET;
        const response = await axios.get(`http://localhost:8000/api/user/User/getAllUsers?isAdmin=${canViewAdmin}`, {
          withCredentials: true
        })
        setUsers(response.data.data);
      } catch (error) {
        // Handle errors here
        console.error("Cannot view user:", error);
      }
    }

  return (
    <div className="relative overflow-x-auto w-[85%] mb-[100px]">
      <table className="w-full text-sm text-left bg-[#F5F5F5]">
        <thead className="text-xs text-gray-700 uppercase bg-[#F5F5F5]">
          <tr className="border-b-2 border-[#A4A4A4]">
          <th scope="col" class="px-6 py-3">
            Avatar
                          
                          </th>
            <th scope="col" className="px-6 py-3">
              First Name
            </th>
            <th scope="col" className="px-6 py-3">
              Last Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3 flex">
              Roles
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.map((user) => (
            <tr
              key={user.id}
              className="bg-[#F5F5F5] border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <img src="/user.png" alt="User Avatar" />
              </th>
              <td className="px-20 py-4">{user.firstName}</td>
              <td className="px-6 py-4">{user.lastName}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.roles.join(', ')}</td>
              
              <td>
              <MenuDefault firstName={user.firstName} lastName ={user.lastName} email={user.email} id={user.userId} />

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
