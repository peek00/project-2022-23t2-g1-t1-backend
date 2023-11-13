import React, { useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';

export default function ApprovalButton({ handleApprove, handleReject, submissionState }) {
    const [action, setAction] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleClick = (action) => {
        setAction(action);
        setLoading(true);
        try {
            if (action == "approve") {
                handleApprove();
            }
            else {
                handleReject();
            }
            setTimeout(() => {
                console.log("Hi")
                setLoading(false);
            }, 2000);

        } catch (error) {
            console.error("Error approving request:", error);
            setLoading(false);
        }
    }

    if (action == null) {
        return (
            <div>
                <button
                    className="px-4 py-2 mr-2 text-white bg-green-500 rounded"
                    onClick={() => handleClick("approve")}
                >
                    Approve
                </button>
                <button
                    className="px-4 py-2 text-white bg-red-500 rounded"
                    onClick={() => handleClick("reject")}
                >
                    Reject
                </button>
            </div>
        );
    } else {
        return (
            <div>
                {!loading && submissionState !== "error" ? (  // If finish loading, and not error 
                    submissionState === "accepted" || submissionState === "rejected" ? (
                        <p className="font-bold text-green-500">{submissionState}</p>
                    ) : (
                        <p className="font-bold text-red-500">Error!</p>
                    )
                ) : (
                    loading && <CircularProgress />
                )}
            </div>
        );
    }
}