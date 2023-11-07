import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios

// Default components
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";

// Company Specific 
import MakerCheckerNav from "../components/MakerCheckerNav";
import CreateRequest from "../components/CreateRequest";

export default function UserListingPage() {
  // Handle tab change
  const [activeTab, setActiveTab] = useState("pending");
  const handleTabChange = (newState) => {
    setActiveTab(newState);
  };

  // Start: Listener for local storage
  const [selectedCompany, setSelectedCompany] = useState("");
  useEffect(() => {
    const storedCompany = localStorage.getItem("selectedCompany");
    if (storedCompany) {
      setSelectedCompany(storedCompany);
    }
  }, []);
  window.addEventListener('storage', () => {
    setSelectedCompany(localStorage.getItem('selectedCompany'));
  })
  // End: Listener for local storage

  // Handle data fetching
  const [data, setData] = useState({});
  const [stringData, setStringData] = useState({});

  // Fetch data form backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (data[activeTab]) {
          // If data exists, don't fetch again
          console.log("Data exists, not fetching");
          return;
        }
        console.log("Fetching data");
        let url = "";
        if (activeTab === "pending") {
          url = "http://localhost:8000/api/maker-checker/approval/pending?companyid=" + selectedCompany;
        } else if (activeTab === "requested") {
          url = "http://localhost:8000/api/maker-checker/approval/requestor?companyid=" + selectedCompany;
        } else if (activeTab === "history") {
          url = "http://localhost:8000/api/maker-checker/approval/approver?companyid=" + selectedCompany;
        } else if (activeTab === "create") {
          console.log("now what")
        }
        const response = await axios.get(url, {
          withCredentials: true,
        });
        setData((prevData) => ({
          ...prevData,
          [activeTab]: response.data, // Store the fetched data in the dictionary
        }));
        setStringData((prevData) => ({
          ...prevData,
          [activeTab]: JSON.stringify(response.data), // Store the fetched data in the dictionary
        }));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [activeTab]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-[20%]  min-h-screen ">
        <SideBar />
      </div>

      {/* Content Area */}
      <div className="w-4/5 min-h-screen mt-20 overflow-y-auto ms-20">
        <TopBar />
        <MakerCheckerNav activeTab={activeTab} onTabChange={handleTabChange} />
        <div className="mt-10"> You are currently on <span className="underline"> {activeTab}</span> for <span className="underline"> {selectedCompany}</span></div>
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
