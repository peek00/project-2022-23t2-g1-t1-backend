import React, { useState, useEffect } from "react";

import RequestDetailModal from "./RequestDetailModal";
import ApprovalButton from "./ApprovalButton";

export default function ApprovalTable({ data, activeTab, selectedCompany }) {
    // Handle data load
    const [shownData, setShownData] = useState([]);

    useEffect(() => {
        // Update the shownData when data or activeTab changes
        if (data[activeTab]) {
            setShownData(data[activeTab]);
        }
    }, [data, activeTab]);

    // @ChatGPT
    function getRelativeTimeOrExpired(timestamp) {
        const now = new Date();
        const timestampDate = new Date(timestamp);
        // const timeDifference =  now -timestampDate ;
        const timeDifference = timestampDate - now;

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
            (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );

        if (timeDifference < 0) {
            return false;
        } else if (days > 0) {
            return `${days} day${days > 1 ? "s" : ""}, ${hours} hr${hours > 1 ? "s" : ""
                }`;
        } else if (hours > 0) {
            return `${hours} hr${hours > 1 ? "s" : ""}, ${minutes} min${minutes > 1 ? "s" : ""
                }`;
        } else {
            return `${minutes} min${minutes > 1 ? "s" : ""}`;
        }
    }

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
                    No pending requests.
                </div>
            </div>
        );
    }
    return (
        <div >
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-xs font-bold tracking-wider text-left uppercase text-black-500">
                            Request Type
                        </th>
                        <th className="px-6 py-3 text-xs font-bold tracking-wider text-left uppercase text-black-500">
                            Request Details
                        </th>
                        <th className="px-6 py-3 text-xs font-bold tracking-wider text-left uppercase text-black-500">
                            Comments
                        </th>
                        <th className="w-6 px-6 py-3 text-xs font-bold tracking-wider text-left uppercase truncate text-black-500">
                            Requested By
                        </th>
                        <th className="px-6 py-3 text-xs font-bold tracking-wider text-left uppercase text-black-500 ">
                            Expiry
                        </th>
                        <th className="px-6 py-3 text-xs font-bold tracking-wider text-left uppercase text-black-500">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {shownData.map((request, index) => (
                        <tr
                            key={index}
                            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                {request.request_type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {/* <button> Click Me</button> */}
                                <RequestDetailModal data={request}/>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {request.comments || "N/A"}
                            </td>
                            <td className="w-5 px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase truncate">
                                {request.requestor_id || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {getRelativeTimeOrExpired(request.request_expiry) === false
                                    ? "Expired"
                                    : getRelativeTimeOrExpired(request.request_expiry)}{" "}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                    {getRelativeTimeOrExpired(request.request_expiry) ===
                                        false ? (
                                        <div>
                                            <button
                                                className="px-4 py-2 mr-2 text-white bg-gray-400 rounded cursor-not-allowed"
                                                disabled
                                            >
                                                Invalid
                                            </button>
                                        </div>
                                    ) : (
                                        <ApprovalButton
                                        uid = {request.uid}
                                        selectedCompany={selectedCompany}
                                        />
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
