import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function WithdrawButton({ handleWithdraw }) {
    const [action, setAction] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClick = (action) => {
        setAction(action);
        console.log(action)
        try {
            handleWithdraw();
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Error approving request:", error);
            setLoading(false);
        }
    };

    if (action == false) {
        return (
            <div>
                <button
                    className="px-4 py-2 mr-2 text-white bg-gray-400 rounded"
                    onClick={() => {
                        handleClick(true);
                    }}
                >
                    Withdraw
                </button>
            </div>
        );
    } else {
        return (
            <div>
                {loading ? (
                    <div className="px-5"> 
                        <CircularProgress />
                    </div>
                ) : (
                    <p className="font-bold text-gray-600 ">Withdrawn</p>
                )}
            </div>
        );
    }
}
