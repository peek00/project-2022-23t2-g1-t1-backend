import { useEffect, useState } from "react";
import MenuDefault from "./MenuDefault.jsx";
import axios from "axios";

export default function UserTable() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
      axios.get("http://localhost:8000/api/user/User/getAllUsers", {
        withCredentials: true
      })
      .then((response) => {
        console.log(response.data);
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }, []);

  return (
    <div className="relative overflow-x-auto w-[75%]">
      <table className="w-full text-sm text-left bg-[#F5F5F5]">
        <thead className="text-xs text-gray-700 uppercase bg-[#F5F5F5]">
          <tr className="border-b-2 border-[#A4A4A4]">
          <th scope="col" class="px-6 py-3">
            Avatar
                          
                          </th>
            <th scope="col" className="px-6 py-3">
              Full Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3 flex">
              Points
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
              <td className="px-20 py-4">{user.fullName}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">100</td>
              
              <td>
                <MenuDefault />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
