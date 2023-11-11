import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import { API_BASE_URL } from "@/config/config";

import RequestDetailModal from "./RequestDetailModal";
import WithdrawButton from "./WithdrawButton";

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

    // Handle approval or response
    const handleEdit = async (uid) => {
        console.log("Edit not implemented");
    };

    // Handle approval or response
    const handleWithdraw = async (uid) => {
        const formObject = {
            uid: uid,
            status: "withdrawn",
            companyid: selectedCompany,
        };

        const withdrawUrl = API_BASE_URL + "/api/maker-checker/approval/withdraw";

        try {
            const response = await axios.post(withdrawUrl, formObject, {
                withCredentials: true,
            });
            // You may want to update your UI or perform other actions here
        } catch (error) {
            // Handle errors here
            console.error("Error approving:", error);
        }
    };
    if (!shownData || shownData.length === 0) {
        return (
            <div className="">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left text-black uppercase">
                                Request Type
                            </th>
                            <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left text-black uppercase">
                                Request Details
                            </th>
                            <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left text-black uppercase truncate">
                                Requested On
                            </th>
                            <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left text-black uppercase">
                                Expiry
                            </th>
                            <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left text-black uppercase">
                                Status
                            </th>
                            <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left text-black uppercase">
                                Action
                            </th>
                        </tr>
                    </thead>
                    
                </table>
                <div
                    className="grid text-2xl text-center text-gray-300 place-items-center"
                    style={{ height: "500px" }}
                >
                    No pending requests.
                </div>
            </div>
        );
    }
    return (
        <div>
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left text-black uppercase">
                            Request Type
                        </th>
                        <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left text-black uppercase">
                            Request Details
                        </th>
                        <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left text-black uppercase truncate">
                            Requested On
                        </th>
                        <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left text-black uppercase">
                            Expiry
                        </th>
                        <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left text-black uppercase">
                            Status
                        </th>
                        <th className="w-1/6 py-3 text-xs font-bold tracking-wider text-left text-black uppercase">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {shownData.map((request, index) => (
                        <tr
                            key={index}
                            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                            <td className="w-5 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase truncate">{request.request_type}</td>
                            <td className="w-5 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase truncate">
                                <RequestDetailModal data={request} />
                            </td>
                            <td className="w-5 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase truncate">
                                {getElapsedRelativeTime(request.created_at) || "N/A"}
                            </td>
                            <td className="w-5 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase truncate">
                                {getRelativeTimeOrExpired(request.request_expiry) === false
                                    ? "Expired"
                                    : getRelativeTimeOrExpired(request.request_expiry)}
                            </td>
                            <td className="py-4 whitespace-nowrap">
                                <span
                                    className={`font-bold ${request.status === "pending"
                                        ? "text-green-500"
                                        : request.status === "withdrawn"
                                            ? "text-pink-500"
                                            : ""
                                        }`}
                                >
                                    {request.status.charAt(0).toUpperCase() +
                                        request.status.slice(1)}
                                </span>
                            </td>
                            <td className="py-4 whitespace-nowrap">
                                <div>
                                    {request.status === "pending" ? (
                                        <div>
                                            <WithdrawButton handleWithdraw={() => handleWithdraw(request.uid)} />
                                            {/* <button
                                                className="px-4 py-2 mr-2 text-white bg-gray-400 rounded"
                                                onClick={() => handleWithdraw(request.uid)}
                                            >
                                                Withdraw
                                            </button> */}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 "> No Action </span>
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
