import { useEffect, useState,useContext } from "react";
import axios from "axios";
import EditAccount from "./EditAccount.jsx";
import {API_BASE_URL} from "@/config/config";

export default function UserAccountTable(){
    const [accounts, setAccounts] = useState([]);

    // company and points

    useEffect(() => {
        setAccounts(
        axios.get(API_BASE_URL+"/api/points/allpointsaccounts", {
          withCredentials: true
        })
        .then((response) => {
          console.log(response.data);
          setAccounts(response.data.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        }))
      }, []);
  
    return (
      <div className="relative overflow-x-auto w-[85%] mb-[100px]">
        <table className="w-full text-sm text-left bg-[#F5F5F5]">
          <thead className="text-xs text-gray-700 uppercase bg-[#F5F5F5]">
            <tr className="border-b-2 border-[#A4A4A4]">
                <th scope="col" className="px-6 py-3">
                    Company
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
                <td className="px-20 py-4">{account.company_id}</td>
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