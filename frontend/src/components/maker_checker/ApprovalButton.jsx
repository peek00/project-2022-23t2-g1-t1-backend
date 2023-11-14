import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios"; // Import Axios
import {API_BASE_URL} from "@/config/config";

export default function ApprovalButton({uid, selectedCompany}) {
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submissionState, setSubmissionState] = useState(null);
  
  const handleApprove = async (uid) => {
    setLoading(true);
    setAction("approve");
    const formObject = {
        uid: uid,
        status: "approved",
        companyid: selectedCompany,
    };

    const approveUrl = API_BASE_URL+"/api/maker-checker/approval/resolve";

    try {
        const response = await axios.post(approveUrl, formObject, {
            withCredentials: true,
        });

        setTimeout(() => {
          setLoading(false);
        }, 2000);
        // Handle the success response here
        setSubmissionState("approved")
        
        // You may want to update your UI or perform other actions here
    } catch (error) {
        // Handle errors here
        setSubmissionState("error")
    } finally {
      setLoading(false);
    }
};

const handleReject = async (uid) => {
  setLoading(true);
  setAction("reject");
  const formObject = {
      uid: uid,
      status: "rejected",
      companyid: selectedCompany,
  };
  const approveUrl = API_BASE_URL+"/api/maker-checker/approval/resolve";
  try {
      const response = await axios.post(approveUrl, formObject, {
          withCredentials: true,
      });
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      setSubmissionState("rejected")
  } catch (error) {
      // Handle errors here
      setSubmissionState("error")
  } finally {
    setLoading(false);

  }
};

  if (action == null) {
    return (
      <div>
        <button
          className="px-4 py-2 mr-2 text-white bg-green-500 rounded"
          onClick={() => handleApprove(uid)}
          >
          Approve
        </button>
        <button
          className="px-4 py-2 text-white bg-red-500 rounded"
          onClick={() => handleReject(uid)}
        >
          Reject
        </button>
      </div>
    );
  } else {
    return (
      <div>
        {!loading && submissionState !== "error" ? ( // True && 
          submissionState === "approved" || submissionState === "rejected" ? (
            <p
              className={`font-bold ${
                submissionState === "rejected"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {submissionState.charAt(0).toUpperCase() +
                submissionState.slice(1)}
            </p>
          ) : (
            <p className="font-bold text-gray-500">Error!</p>
          )
        ) : (
          loading && <CircularProgress />
        )}
      </div>
    );
  }
}
