import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios

export default function ApprovalTable({ data, activeTab, selectedCompany }) {
    // Handle data load
    const [shownData, setShownData] = useState([]);

    useEffect(() => {
        // Update the shownData when data or activeTab changes
        if (data[activeTab]) {
            setShownData(data[activeTab]);
        }
    }, [data, activeTab]);

    if (!shownData || shownData.length === 0) {
        return <div className="ms-[40px]">No data available.</div>;
    }
    // @ChatGPT 
    function getRelativeTimeOrExpired(timestamp) {
        const now = new Date();
        const timestampDate = new Date(timestamp);
        // const timeDifference =  now -timestampDate ;
        const timeDifference = timestampDate - now;

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        if (timeDifference < 0) {
            return false;
        } else if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''}, ${hours} hr${hours > 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `${hours} hr${hours > 1 ? 's' : ''}, ${minutes} min${minutes > 1 ? 's' : ''}`;
        } else {
            return `${minutes} min${minutes > 1 ? 's' : ''}`;
        }
    }

    // Handle approval or response
    const handleApprove = async (uid) => {
        // const formObject = {
        //     uid: uid,
        //     status: "approved",
        //     companyid: selectedCompany,
        // };
        console.log("Edit not implemented");

        // const approveUrl = `http://localhost:8000/api/maker-checker/approval/resolve`;

        // try {
        //     const response = await axios.post(approveUrl, formObject, {
        //         withCredentials: true,
        //     });

        //     // Handle the success response here
        //     console.log("Approved:", response.data);

        //     // You may want to update your UI or perform other actions here
        // } catch (error) {
        //     // Handle errors here
        //     console.error("Error approving:", error);
        // }
    };

    // Handle approval or response
    const handleWithdraw = async (uid) => {
        const formObject = {
            uid: uid,
            status: "withdrawn",
            companyid: selectedCompany,
        };

        const approveUrl = `http://localhost:8000/api/maker-checker/approval/withdraw`;

        try {
            const response = await axios.post(approveUrl, formObject, {
                withCredentials: true,
            });

            // Handle the success response here
            console.log("Approved:", response.data);

            // You may want to update your UI or perform other actions here
        } catch (error) {
            // Handle errors here
            console.error("Error approving:", error);
        }
    };
    return (
        <div className="ms-[40px]">
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
                            Requested On
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase ">
                            Expiry
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Status
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
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
                            <td className="px-6 py-4 whitespace-nowrap">
                                {request.request_type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button> Click Me</button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {request.created_at || "N/A"}
                            </td>
                            <td className="w-5 px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase truncate">
                                {
                                    getRelativeTimeOrExpired(request.request_expiry) === false
                                        ? "Expired"
                                        : getRelativeTimeOrExpired(request.request_expiry)
                                }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`font-bold ${request.status === "pending" ? 'text-green-500' : request.status === "withdrawn" ? 'text-pink-500' : ''}`}>
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                    {request.status === "pending" ? (
                                        <div>
                                            <button
                                                className="px-4 py-2 mr-2 text-white bg-green-500 rounded"
                                                onClick={() => handleApprove(request.uid)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="px-4 py-2 mr-2 text-white bg-gray-400 rounded"
                                                onClick={() => handleWithdraw(request.uid)}
                                            >
                                                Withdraw
                                            </button>
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
