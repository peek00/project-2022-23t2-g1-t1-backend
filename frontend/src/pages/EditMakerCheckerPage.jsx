import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios

// Default components
import SideBar from "../components/common_utils/SideBar";
import TopBar from "../components/common_utils/TopBar";

export default function UserListingPage() {
    // Handle tab change
    const [activeTab, setActiveTab] = useState("pending");
    const handleTabChange = (newState) => {
        setActiveTab(newState);
    };

    const [templateData, setTemplateData] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                let templateUrl = `http://localhost:8000/api/maker-checker/templates/`;
                let permissionUrl = `http://localhost:8000/api/maker-checker/permission/`;
                console.log("Fetching data from: " + permissionUrl);
                
                // Fetching template data
                const templateResponse = await axios.get(templateUrl, {
                    withCredentials: true,
                });
                setTemplateData(templateResponse.data);
                console.log(templateResponse.data);
                // Fetching permission data
                const permissionResponse = await axios.get(permissionUrl, {
                    withCredentials: true,
                });
                console.log(permissionResponse.data);
                


            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-[20%]  min-h-screen ">
                <SideBar />
            </div>

            {/* Content Area */}
            <div className="w-4/5 min-h-screen mt-20 overflow-y-auto ms-20">
                <TopBar />
                Templates Permissions
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Request Type
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Request Details
                            </th>
                            <th className="w-6 px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase truncate">
                                Allowed Approvers
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase ">
                                Allowed Requestors
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Action
                            </th>
                        </tr>
                    </thead>
                    {/* Body */}
                    <tbody>
                        {templateData.map((request, index) => (
                            <tr
                                key={index}
                                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {request.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button> Click Me</button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {request.allowed_approvers}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {request.allowed_requestors}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div>
                                            <button
                                                className="px-4 py-2 mr-2 text-white bg-green-500 rounded"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
