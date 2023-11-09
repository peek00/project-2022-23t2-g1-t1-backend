import React, { useState } from "react";


export default function MakerCheckerNav({ activeTab, onTabChange }) {

  const handleButtonClick = (state) => {
    onTabChange(state);
  };
  };

  return (
    <div className="top-[20%] left-[25%] w-[90%] mb-5">
      <div className="flex w-[50]align-bottom">
        <div className="mb-5 text-4xl">
          Approvals
        </div>

        <a
          href="/makerchecker/edit"
          className="float-right text-blue-500 ms-auto hover:underline"
          onClick={() => handleButtonClick("create")}
          >
          Edit Maker Checker
        </a>
      </div>

      <div className="flex">
        <button
          className={`me-5 btn ${activeTab === "pending" ? "active font-bold border-b-4 border-blue-500" : ""}`}
          onClick={() => handleButtonClick("pending")}
        >
          Pending Approvals
        </button>
        <button
          className={`mx-5 btn ${activeTab === "requested" ? "active font-bold border-b-4 border-green-500" : ""}`}
          onClick={() => handleButtonClick("requested")}
        >
          My Request
        </button>
        <button
          className={`mx-5 btn ${activeTab === "history" ? "active font-bold border-b-4 border-red-500" : ""}`}
          onClick={() => handleButtonClick("history")}
        >
          History
        </button>
        <button
          style={{ verticalAlign: "baseline" }}
          className="float-right px-4 py-2 text-white align-bottom bg-blue-500 rounded ms-auto"
          onClick={() => handleButtonClick("create")}
        >
          Create Request
        </button>
      </div>

    </div>
  );
}
