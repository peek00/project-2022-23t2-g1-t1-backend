import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios

// Default components
import SideBar from "../components/common_utils/SideBar";
import TopBar from "../components/common_utils/TopBar";

// Specific imports
import Template from "../components/maker_checker/Template";
import {API_BASE_URL} from "@/config/config";

export default function UserListingPage() {
    const [templateData, setTemplateData] = useState([]);

    const onUpdate = async (updatedData) => {
        try {
            // Make an HTTP request to update the data on the server
            const updatedTemplate = await axios.put(
                API_BASE_URL+"/api/maker-checker/templates/",
                updatedData,
                {
                    withCredentials: true,
                }
            );
            // Update the local state with the updated data
            const newTemplateData = [...templateData];
            setTemplateData(newTemplateData);
        } catch (error) {
            console.error("Error updating template:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let templateUrl = API_BASE_URL+"/api/maker-checker/templates/";
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
            <div className="w-[20%]  min-h-screen ">
                <SideBar />
            </div>
            {/* Content Area */}
            <div className="w-4/5 min-h-screen mt-20 overflow-y-auto ms-20">
                <TopBar />
                <div className="mb-5 text-4xl">
                    Edit Maker Checker Permissions
                </div>
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
