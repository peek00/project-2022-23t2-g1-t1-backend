import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function SubmitRequestButton({ handleSubmit, setSubmissionState }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await handleSubmit();
      setSubmissionState("success");
    } catch (error) {
      console.error("Error approving request:", error);
      setSubmissionState("error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <button
          className="px-4 py-2 text-white bg-red-500 rounded"
          onClick={handleClick}
        >
          Submit Request
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }
}
