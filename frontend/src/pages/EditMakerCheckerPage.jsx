import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios

// Default components
import SideBar from "../components/common_utils/SideBar";
import TopBar from "../components/common_utils/TopBar";

// Specific imports
import Template from "../components/maker_checker/Template";
import { API_BASE_URL } from "@/config/config";

export default function UserListingPage() {
    const [templateData, setTemplateData] = useState([]);
    const [updateStatus, setUpdateStatus] = useState(""); // "pending", "success", "error"

    const onUpdate = async (updatedData) => {
        try {
            // Make an HTTP request to update the data on the server
            const updatedTemplate = await axios.put(
                API_BASE_URL + "/api/maker-checker/templates/",
                updatedData,
                {
                    withCredentials: true,
                }
            );
            // Update the local state with the updated data
            const newTemplateData = [...templateData];
            setTemplateData(newTemplateData);
            setUpdateStatus("success");
        } catch (error) {
            setUpdateStatus("error");
            console.error("Error updating template:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let templateUrl = API_BASE_URL + "/api/maker-checker/templates/";
                // Fetching template data
                const templateResponse = await axios.get(templateUrl, {
                    withCredentials: true,
                });
                setTemplateData(templateResponse.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <SideBar />
            {/* <TopBar /> */}
            {/* Content Area */}
            <div className="w-4/5 min-h-screen overflow-y-auto mt-28 ms-[20%]">
                <div className="mb-5 text-4xl">Edit Template Permissions</div>
                <div className="px-5 py-5">
                    <li>
                        Allowed approvers and requestors are stored as a Comma Separated
                        String.
                    </li>
                    <li>Do not include spaces when editing the requestors.</li>
                </div>

                {updateStatus === "success" ? (
        <div className="flex w-1/2 px-5 py-5 mb-5 text-green-800 bg-green-200 border border-green-800">
          Permissions updated successfully! Please refresh to see updated changes.
        </div>
      ) : updateStatus === "error" ? (
        <div className="flex w-1/2 px-5 py-5 mb-5 text-red-800 bg-red-200 border border-red-800">
          Error encountered, permissions were not updated. Please refresh and try again.
        </div>
      ) : null}
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="w-1/6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Type
                            </th>
                            <th className="w-1/6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Details
                            </th>
                            <th className="w-1/6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase truncate">
                                Allowed Approvers
                            </th>
                            <th className="w-1/6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase ">
                                Allowed Requestors
                            </th>
                            <th className="w-1/6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Action
                            </th>
                        </tr>
                    </thead>
                    {/* Body */}
                    <tbody>
                        {templateData.map((template, index) => (
                            <Template
                                key={index}
                                index={index}
                                data={template}
                                onUpdate={onUpdate}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
