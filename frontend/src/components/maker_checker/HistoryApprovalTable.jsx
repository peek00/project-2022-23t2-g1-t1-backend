import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios

import RequestDetailModal from "./RequestDetailModal";

export default function HistoryApprovalTable({ data, activeTab, selectedCompany }) {
    // Handle data load
    const [shownData, setShownData] = useState([]);

    useEffect(() => {
        // Update the shownData when data or activeTab changes
        if (data[activeTab]) {
            setShownData(data[activeTab]);
        }
    }, [data, activeTab]);


    // @ChatGPT 
    function getElapsedRelativeTime(timestamp) {
        const now = new Date();
        const timestampDate = new Date(timestamp);
        const timeDifference = now - timestampDate;

        if (timeDifference < 0) {
            return false;
        }

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
            (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );

        if (days > 0) {
            return `${days} day${days > 1 ? "s" : ""}, ${hours} hr${hours > 1 ? "s" : ""
                } ago`;
        } else if (hours > 0) {
            return `${hours} hr${hours > 1 ? "s" : ""}, ${minutes} min${minutes > 1 ? "s" : ""
                } ago`;
        } else {
            return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
        }
    }
    // Show if there is no data
    if (!shownData || shownData.length === 0) {
        return (
            <div>
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left uppercase text-black-500">
                                Request Type
                            </th>
                            <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left uppercase text-black-500 ">
                                Request Details
                            </th>
                            <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left uppercase text-black-500">
                                Comments
                            </th>
                            <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left uppercase truncate text-black-500">
                                Requested By
                            </th>
                            <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left uppercase text-black-500 ">
                                Expiry
                            </th>
                            <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left uppercase text-black-500">
                                Actions
                            </th>
                        </tr>
                    </thead>
                </table>
                <div className="grid text-2xl text-center text-gray-300 place-items-center" style={{ height: "500px" }}>
                    No requests resolved by you yet.
                </div>
            </div>
        );
    }

    // Show if there is requests
    return (
        <div >
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left uppercase text-black-500">
                            Request Type
                        </th>
                        <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left uppercase text-black-500">
                            Request Details
                        </th>
                        <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left uppercase truncate text-black-500">
                            Requested Time
                        </th>
                        <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left uppercase truncate text-black-500">
                            Requested By
                        </th>
                        <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left uppercase text-black-500">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {shownData.map((request, index) => (
                        <tr
                            key={index}
                            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                            <td className="w-5 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase truncate">
                                {request.request_type}
                            </td>
                            <td className="w-5 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase truncate">
                                <RequestDetailModal data={request} />
                            </td>
                            <td className="w-5 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase truncate">
                                {getElapsedRelativeTime(request.resolution_at) || "N/A"}
                            </td>
                            <td className="w-5 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase truncate">
                                {request.requestor_id || "N/A"}
                            </td>
                            <td className="w-5 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase truncate">
                                <span className={`font-bold ${request.status === "approved" ? 'text-green-500' : request.status === "rejected" ? 'text-red-500' : ''}`}>
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </span>
                            </td>


                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
