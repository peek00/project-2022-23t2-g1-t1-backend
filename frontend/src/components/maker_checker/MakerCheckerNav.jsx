import React, { useState } from "react";

export default function MakerCheckerNav({ activeTab, onTabChange }) {

  const handleButtonClick = (state) => {
    onTabChange(state);
};

  return (
    <div className="top-[20%] left-[25%] w-[60%]">
      <div className="mb-5 text-4xl">Approvals</div>
      <button
        className={`me-5 btn ${activeTab === "pending" ? "active" : ""}`}
        onClick={() => handleButtonClick("pending")}
      >
        Pending Approvals
      </button>
      <button
        className={`mx-5 btn ${activeTab === "mine" ? "active" : ""}`}
        onClick={() => handleButtonClick("requested")}
      >
        My Request
      </button>
      <button
        className={`mx-5 btn ${activeTab === "history" ? "active" : ""}`}
        onClick={() => handleButtonClick("history")}
      >
        History
      </button>
      <button 
      className="float-right px-4 py-2 text-white bg-blue-500 rounded"
      onClick={() => handleButtonClick("create")}
      >
        Create Request
      </button>
    </div>
  );
}
