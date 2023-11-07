import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios

// Default components
import SideBar from "../components/common_utils/SideBar";
import TopBar from "../components/common_utils/TopBar";
import {API_BASE_URL} from "@/config/config";

// Company Specific
// Company Specific
import MakerCheckerNav from "../components/MakerCheckerNav";
import CreateRequest from "../components/CreateRequest";
import PendingApprovalTable from "../components/PendingApprovalTable";
import RequestedApprovalTable from "../components/RequestedApprovalTable";
import HistoryApprovalTable from "../components/HistoryApprovalTable";
import CompanyDropdown from "../components/CompanyDropdown";

export default function UserListingPage() {
  // Handle tab change
  const [activeTab, setActiveTab] = useState("pending");
  const handleTabChange = (newState) => {
    setActiveTab(newState);
  };

  // Start: Listener for local storage
  const [selectedCompany, setSelectedCompany] = useState("");
  const [data, setData] = useState({});
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
            url = `http://localhost:8000/api/maker-checker/approval/approver?companyid=${selectedCompany}`;
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
  }, [activeTab, selectedCompany]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-[20%]  min-h-screen ">
        <SideBar />
      </div>

      {/* Content Area */}
      <div className="w-4/5 min-h-screen overflow-y-auto ms-10 mt-28">
        <TopBar />
        <MakerCheckerNav activeTab={activeTab} onTabChange={handleTabChange} />
        <div className="mt-10">
          {" "}
          You are currently on <span className="underline">
            {" "}
            {activeTab}
          </span>{" "}
          for <span className="underline"> {selectedCompany}</span>
        </div>
        <div className="mt-10"> Data: {stringData[activeTab]}</div>
        {/* TODO: Jye Yi create a way to represent the data over here. Use the data[activeTab] instead of String
            StringData is a stringified version of the data.
        */}
        {activeTab === "create" && (
          <div>
            <CreateRequest />
          </div>
        )}
      </div>
    </div>
  );
}
