import React, { useState } from "react";

export default function RequestTemplate({ requestDetail, onSubmit, selectedCompany }) {
  // JS Function come here
  const formDetails = requestDetail["details"];
  const approvers = requestDetail["allowed_approvers"];
  const handleSubmit = (event) => {
    console.log(event)
    event.preventDefault();
    const formData = { request_details: {} }; // Initialize formData object

    Object.entries(formDetails).forEach(([fieldName, fieldType]) => {
      const inputElement = document.querySelector(`[name="${fieldName}"]`);
      formData.request_details[fieldName] =
        fieldType === "bool" ? inputElement.checked : inputElement.value;
    });
    // Filling in additional details
    formData["request_type"] = requestDetail["type"];
    formData["status"] = "pending";
    formData["companyid"] = selectedCompany;
    formData["approval_role"] = approvers;
    
    onSubmit(formData);
  }

  return (
    <div className="ms-48 ">
  <p>
    Make a <span className="font-bold">{requestDetail["type"]}</span> request.<br />
    This request can only be approved by <span className="font-bold">{approvers}</span>.<br />
    This request is being made for company <span className="font-bold">{selectedCompany}</span>.
  </p>
  <form className="mt-6" onSubmit={handleSubmit}>
    {Object.entries(formDetails).map(([fieldName, fieldType]) => {
      let inputField = null;
      if (fieldType === "str") {
        inputField = (
          <input type="text" name={fieldName} className="p-2 border w-96" />
        );
      } else if (fieldType === "company") {
        inputField = (
          <input type="text" name={fieldName} className="p-2 border w-96" value={selectedCompany}/>
        );
      } else if (fieldType === "email") {
        inputField = (
          <input type="email" name={fieldName} className="p-2 border w-96" />
        );
      } else if (fieldType === "int" || fieldType === "float") {
        inputField = (
          <input type="number" name={fieldName} className="p-2 border w-96" />
        );
      } else if (fieldType === "bool") {
        inputField = (
          <input type="checkbox" name={fieldName} className="mr-2" />
        );
      } else if (fieldType === "date") {
        inputField = (
          <input type="date" name={fieldName} className="mr-2" />
        );
      }

        return (
          <div key={fieldName} className="flex items-center mb-4">
            <label
              htmlFor={fieldName}
              className="block w-48 mx-5 mb-2 font-bold text-gray-700"
            >
              {fieldName}
            </label>
            <div className="px-5">
              {inputField}
            </div>
          </div>
        );
      })}
      <button
          className="px-4 py-2 text-white bg-blue-500 rounded"
          onClick={handleSubmit}
        >
          Submit Request
        </button>
        </form>
      </div>
    );
  } 

