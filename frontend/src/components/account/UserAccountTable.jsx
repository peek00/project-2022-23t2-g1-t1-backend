import {
  Link,
  IconButton,
} from "@material-tailwind/react";
import axios from "axios";
import EditAccount from "./EditAccount.jsx";

function NextIcon() {
  return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M10 20A10 10 0 1 0 0 10a10 10 0 0 0 10 10zM8.711 4.3l5.7 5.766L8.7 15.711l-1.4-1.422 4.289-4.242-4.3-4.347z"/></svg>
  );
}

export default function UserAccountTable(props){
    const { accounts, companyId } = props;
    console.log("Table rendering")

    return (
      <div className="relative overflow-x-auto w-[85%] mb-[100px]">
        <table className="w-full text-sm text-left bg-[#F5F5F5]">
          <thead className="text-xs text-gray-700 uppercase bg-[#F5F5F5]">
            <tr className="border-b-2 border-[#A4A4A4]">
                <th scope="col" className="px-6 py-3">
                    First Name
                </th>
                <th scope="col" className="px-6 py-3">
                    Last Name
                </th>
                <th scope="col" className="px-6 py-3">
                    Email
                </th>
                <th scope="col" className="px-6 py-3">
                    Points
                </th>
            </tr>
          </thead>
          {accounts.length > 0 ? (
            <tbody>
              {accounts.map((account) => (
                <tr
                  key={account.id}
                  className="bg-[#F5F5F5] border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-6 py-4">{account.userData.firstName}</td>
                  <td className="px-6 py-4">{account.userData.lastName}</td>
                  <td className="px-6 py-4">{account.userData.email}</td>
                  <td className="px-6 py-4">{account.balance}</td>
                  
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="4">No accounts available</td>
              </tr>
            </tbody>)}
        </table>
      </div>
    );

}