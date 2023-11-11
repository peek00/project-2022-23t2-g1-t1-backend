import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/config';
import MenuDefault from '../common_utils/MenuDefault';

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const nextPage = useRef(null);
  const previousPage = useRef(null);
  const lastEvaluatedKey = useRef(null);
  const viewAdmin = useRef(null);
  const [viewUserFinished, setViewUserFinished] = useState(false);
  const hasNext = useRef(true);

  useEffect(() => {
    viewUser();
    
    // Fetch the role from localStorage or an API here
    const storedRole = JSON.parse(localStorage.getItem('permissions'));
    console.log(storedRole);
    setRole(storedRole);
  }, []);

  useEffect(() => {
    // Prefetch the next page data only when viewUser has finished or the component has mounted
    if (viewUserFinished||currentPage) {
      prefetchNextPageData();
    }
  }, [viewUserFinished,currentPage]);

  const viewUser = async () => {
    try {
      const viewUserPermissions = await axios.post(
        API_BASE_URL + '/policy/permissions',
        {
          pageLs: ['user/User/getAllUsers?isAdmin=True'],
        },
        {
          withCredentials: true,
        }
      );
      const canViewAdmin =
        viewUserPermissions.data['user/User/getAllUsers?isAdmin=True'].GET;
      viewAdmin.current = canViewAdmin;

      console.log(lastEvaluatedKey.current);

      let response;
      if (lastEvaluatedKey.current === null) {
        response = await axios.get(
        
          API_BASE_URL+ `/api/user/User/getAllUsersPaged?isAdmin=${canViewAdmin}` ,
          {
            withCredentials: true,
          }
        );
        console.log(response)
        setUsers(response.data.data.users);
      lastEvaluatedKey.current = response.data.data.newLastEvaluatedKey;

      if(response.data.data.next){
        hasNext.current = true;
      }
      else{
        hasNext.current = false;
      }
      } 
      
      
      setViewUserFinished(true); // Indicate that viewUser has finished
    } catch (error) {
      console.error('Cannot view user:', error);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
    setUsers(previousPage.current);
  };

  const handleNextPage = () => {
    previousPage.current = users;
    if(lastEvaluatedKey.current != null){
    setCurrentPage((prevPage) => prevPage + 1);
    setUsers(nextPage.current);
  }
  else{
    alert("No more pages to show")
  }
};

  const prefetchNextPageData = async () => {

    if(lastEvaluatedKey!=null){
    try {
      const response = await axios.get(
      
        API_BASE_URL+ `/api/user/User/getAllUsersPaged?isAdmin=${viewAdmin.current}&lastEvaluatedKey=${lastEvaluatedKey.current}`,
        {
          withCredentials: true,
        }
      );

      // You can use the prefetched data as needed, for example, update state or store it in a ref.
      nextPage.current = response.data.data.users;
      hasNext.current = response.data.data.next;
      console.log(hasNext.current);
      lastEvaluatedKey.current = response.data.data.newLastEvaluatedKey;
      console.log(nextPage.current);
      console.log(response)
    } catch (error) {
      console.error('Error prefetching data:', error);
    }
  };
};

  // Rest of your component code...



  return (
    <div className="relative overflow-x-auto mb-[100px]">
      <table className="w-full text-sm text-left bg-[#F5F5F5]">
        <thead className="text-xs text-gray-700 uppercase bg-[#F5F5F5]">
          <tr className="border-b-2 border-[#A4A4A4]">
          <th scope="col" className="px-6 py-3">
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
            <th scope="col" className="flex px-6 py-3">
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
              <MenuDefault firstName={user.firstName} lastName ={user.lastName} email={user.email} id={user.userId} role={role} />

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end p-4">
        <button
          className="px-4 py-2 mx-4 text-white bg-blue-500"
          onClick={handlePreviousPage}
        >
          Previous
        </button>
        Current Page : {currentPage}
        <button
          className="px-4 py-2 mx-4 text-white bg-blue-500"
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
    </div>
  
  );


}
