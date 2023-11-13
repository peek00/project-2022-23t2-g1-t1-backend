import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios

import RequestTemplate from "./RequestTemplate";
import { API_BASE_URL } from "@/config/config";

function CreateRequest() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formSubmissionStatus, setFormSubmissionStatus] = useState(""); // "pending", "success", "error"

  const role = JSON.parse(localStorage.getItem("role"));

  const fetchData = async () => {
    try {
      const company = localStorage.getItem("selectedCompany");
      if (company) {
        setSelectedCompany(company);
      }
      let url =
        API_BASE_URL +
        `/api/maker-checker/templates/allowed_requestors?role=${role}`;
      const response = await axios.get(url, {
        withCredentials: true,
      });
      setTemplates(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleButtonClick = (index, data) => {
    console.log(data);
    setSelectedTemplate(data);
    setIsOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle create request form submit
  const handleFormSubmit = (formData) => {
    // TODO Form validation here
    const url = API_BASE_URL + "/api/maker-checker/approval/create";
    axios
      .post(url, formData, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setFormSubmissionStatus("success");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setFormSubmissionStatus("error");
      });
  };
  return (


    
    <div className="w-3/5 mx-auto">
      {formSubmissionStatus === "success" ? (
        <div className="flex px-5 py-5 mx-auto mb-5 text-green-800 bg-green-200 border border-green-800 ms-auto">
          Requested submitted successfully! Please refresh to create another request.
        </div>
      ) : formSubmissionStatus === "error" ? (
        <div className="flex px-5 py-5 mx-auto mb-5 text-red-800 bg-red-200 border border-red-800 ms-auto">
          Error encountered, request was not submitted! Please refresh and try
          again.
        </div>
      ) : null}



      <div className="py-5 bg-gray-200 rounded drop-shadow-lg">
        <div className="relative flex flex-col mb-5 text-middle bg-slate-600">
          {/* Button */}
          <button
            onClick={toggleDropdown}
            className="items-center justify-center w-64 px-10 py-2 mx-auto text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm hover:shadow-md focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          >
            {selectedTemplate == null
              ? "Select an action."
              : selectedTemplate.type}
          </button>
          {isOpen && (
            <div className="w-48 mx-auto origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {templates.map((data, index) => (
                  <button
                    key={index}
                    onClick={() => handleButtonClick(index, data)}
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                  >
                    {data.type}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {selectedTemplate != null && formSubmissionStatus === "" && (
          <RequestTemplate
            requestDetail={selectedTemplate}
            onSubmit={handleFormSubmit}
            selectedCompany={selectedCompany}
          />
        )}
      </div>
    </div>
  );
}

export default CreateRequest;
