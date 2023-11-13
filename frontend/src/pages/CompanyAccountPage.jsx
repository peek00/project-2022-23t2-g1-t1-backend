import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SideBar from '../components/common_utils/SideBar';
import TopBar from '../components/common_utils/TopBar';
import CompanyAccountTable from '../components/account/CompanyAccountTable';
import axios from "axios";
import {API_BASE_URL} from "@/config/config";
import { getAllUserAccountsByCompanyId } from '../apis/points';
import { Spinner } from '@material-tailwind/react';


export default function CompanyAccountPage() {
  const { companyId } = useParams(); 
  const [accounts, setAccounts] = useState([]);
  const [isLoading,setIsLoading] = useState(true);
  // console.log(companyId);
  // company and points

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await getAllUserAccountsByCompanyId(companyId);
        const accountsData = results.data;
        const userIdList = accountsData.map((account) => account["user_id"]);
        await axios.post(API_BASE_URL + `/api/user/User/getAllUsersByIdList`, userIdList, {
          withCredentials: true,
        }).then((response) => {
          const userDataList = response.data.data;
          const accountsWithAdditionalData = accountsData.map((account) => {
            const userData = userDataList.find((user) => user["userId"] === account["user_id"]);
            return { ...account, userData: userData };
          });
          setAccounts(accountsWithAdditionalData);
        }).catch((error) => {
          console.error("Error fetching user data:", error);
        });
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  useEffect(() => {
    console.log("Accounts updated:", accounts);
  }, [accounts]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
        <SideBar />
        {/* <TopBar /> */}

      {/* Content Area */}
      <div className="w-4/5 min-h-screen overflow-y-auto">
        <div className="min-h-screen overflow-y-auto">
        <div className='flex w-[100%] absolute top-[10%]'>  
          <h1 className='text-2xl font-bold ms-11 fixed left-[20%]'>Company Accounts</h1>
        </div>
        <div className='absolute  left-[25%] top-[25%] min-w-[80%]'>
          {
            isLoading ? 
            <Spinner color="teal" size="large" className='mt-20'/> :
            <CompanyAccountTable accounts={accounts} companyId={companyId}/>
          }
        </div>
        </div>
      </div>
    </div>
  );
}
