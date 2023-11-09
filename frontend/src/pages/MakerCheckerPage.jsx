import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios

// Default components
import SideBar from "../components/common_utils/SideBar";
import TopBar from "../components/common_utils/TopBar";

// Company Specific
import MakerCheckerNav from "../components/maker_checker/MakerCheckerNav";
import CreateRequest from "../components/maker_checker/CreateRequest";
import PendingApprovalTable from "../components/maker_checker/PendingApprovalTable";
import RequestedApprovalTable from "../components/maker_checker/RequestedApprovalTable";
import HistoryApprovalTable from "../components/maker_checker/HistoryApprovalTable";
import CompanyDropdown from "../components/maker_checker/CompanyDropdown";


export default function UserListingPage() {
  // Handle tab change
  const [activeTab, setActiveTab] = useState("pending");
  const handleTabChange = (newState) => {
    setActiveTab(newState);
  };
  
  // Start: Listener for local storage
  const [selectedCompany, setSelectedCompany] = useState();
  const handleCompanyChange = (newState) => {
    setSelectedCompany(newState);
  };
    const [data, setData] = useState({});
  console.log(data)
  const [showTable, setShowTable] = useState(false);
  const [stringData, setStringData] = useState({});
  useEffect(() => {
    // Listener for local storage
    const storedCompany = localStorage.getItem("selectedCompany");
    if (storedCompany) {
      setSelectedCompany(storedCompany);
    }
  
    const fetchData = async () => {
      if (activeTab === "create") {
        console.log("In create!");
      } 
      else if (selectedCompany) {
        try {
          let url = "";
          if (activeTab === "pending") {
            url = `http://localhost:8000/api/maker-checker/approval/pending?companyid=${selectedCompany}`;
          } else if (activeTab === "requested") {
            url = `http://localhost:8000/api/maker-checker/approval/requestor?companyid=${selectedCompany}`;
          } else if (activeTab === "history") {
            url = `http://localhost:8000/api/maker-checker/approval/resolved?companyid=${selectedCompany}`;
          }
  
          console.log("Fetching data from: " + url);
          const response = await axios.get(url, {
            withCredentials: true,
          });
          console.log(response.data);
  
          setData((prevData) => ({
            ...prevData,
            [activeTab]: response.data,
          }));
  
          setStringData((prevData) => ({
            ...prevData,
            [activeTab]: JSON.stringify(response.data),
          }));
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      }
    };
  
    fetchData();
    setShowTable(true);
  }, [activeTab, selectedCompany]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-[20%]  min-h-screen ">
        <SideBar />
      </div>

      {/* Content Area */}
      <div className="w-4/5 min-h-screen mt-20 overflow-y-auto ms-20">
        <TopBar />
      <CompanyDropdown selectedCompany={selectedCompany} onSelectCompany={handleCompanyChange}/>
        <MakerCheckerNav activeTab={activeTab} onTabChange={handleTabChange} />

        { showTable && activeTab == "pending" && (<PendingApprovalTable data={data} activeTab={activeTab} selectedCompany={selectedCompany}/>)}
        { showTable && activeTab == "requested" && (<RequestedApprovalTable data={data} activeTab={activeTab} selectedCompany={selectedCompany}/>)}
        { showTable && activeTab == "history" && (<HistoryApprovalTable data={data} activeTab={activeTab} selectedCompany={selectedCompany}/>)}
        {activeTab === "create" && (
          <div>
            <CreateRequest />
          </div>
        )}
      </div>
    </div>
  );
}
