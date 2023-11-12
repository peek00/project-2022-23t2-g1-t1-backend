
import axios from "axios";
import EditAccount from "./EditAccount.jsx";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useUserContext } from "../../context/userContext.jsx";
import { useParams } from "react-router-dom";

export default function UserAccountTable(props){
    const { accounts, companyId } = props;
    const { userData, updateUserData } = useUserContext();
    const { companyid } = useParams();
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
                  <Link to={`/user/account/company/${companyId}/${account.user_id}/editPoints`}><td className="px-6 py-4"><Button>Edit Points</Button></td></Link>
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