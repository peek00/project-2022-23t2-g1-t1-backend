import { useEffect, useState,useContext } from "react";
import axios from "axios";
import EditAccount from "./EditAccount.jsx";
import {API_BASE_URL} from "@/config/config";
import { getAllUserAccountsByCompanyId } from '../../apis/points';


export default function UserAccountTable({ companyId }){
    const [accounts, setAccounts] = useState([]);
    console.log(companyId);

    // company and points

    useEffect(() => {
        getAllUserAccountsByCompanyId(companyId)
          .then(async (results) => {
            const accountsData = results.data;
    
            // Fetch additional data for each account
            const accountsWithAdditionalData = await Promise.all(
              accountsData.map(async (account) => {
                try {
                  const response = await axios.get(API_BASE_URL + `User/getUser?userID=` + account.userId, {
                    withCredentials: true
                  });
                  // Merge the additional data with the account data
                  return {...account, userData: response.data.data };
                } catch (error) {
                  console.error('Error fetching user data:', error);
                  return account; // Return the original account if the request fails
                }
              })
            );
    
            setAccounts(accountsWithAdditionalData);
          })
          .catch((error) => {
            console.error('Error fetching accounts:', error);
          });
        // .then((results) => {
        //   console.log(results.data);
        //   setAccounts(results.data);
        // })
        // .catch((err) => {
        //   return err;
        // })
        // console.log(accounts);
      }, [companyId]);
  
    return (
      <div className="relative overflow-x-auto w-[85%] mb-[100px]">
        <table className="w-full text-sm text-left bg-[#F5F5F5]">
          <thead className="text-xs text-gray-700 uppercase bg-[#F5F5F5]">
            <tr className="border-b-2 border-[#A4A4A4]">
                <th scope="col" className="px-6 py-3">
                    User Name
                </th>
                <th scope="col" className="px-6 py-3">
                    Email
                </th>
                <th scope="col" className="px-6 py-3">
                    Points
                </th>
            </tr>
          </thead>
          <tbody>
            {accounts.length && Array.isArray(accounts) && accounts.map((account) => (
              <tr
                key={account.id}
                className="bg-[#F5F5F5] border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-20 py-4">{account.userData.fullName}</td>
                <td className="px-20 py-4">{account.userData.email}</td>
                <td className="px-6 py-4">{account.balance}</td>               
                <td>
                <EditAccount companyId={account.company_id} pointsId ={account.user_id} points={account.balance} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

}