import React, { useState } from "react";
import RequestDetailModal from "./RequestDetailModal";

export default function Template({ data, index, onUpdate }) {
  const [onEdit, setOnEdit] = useState(false);
  // Define state to track the edited value
  const parseOriginalInput = (string) => {
    // Original input is kinda weird, because it will not put the comma in the string
    let parsedString = "";
    for (let i = 0; i < string.length; i++) {
      parsedString += string[i] + ",";
    }
    return parsedString.slice(0, -1);
  }

  const [editedApprovers, setEditedApprovers] = useState(parseOriginalInput(data.allowed_approvers));
  const [editedRequestors, setEditedRequestors] = useState(parseOriginalInput(data.allowed_requestors));

  const requestDetail = data.request_details;
  console.log(data)

  const parseStringToList = (string) => {
    // Split the string by commas and trim whitespace
    if (string.indexOf(',') > -1) {
      const list = string.split(",").map((item) => item.trim());
      return list;
    }
    return [string]
  };

  // Function to handle the "Update" action
  const handleUpdate = () => {
    // Parse both fields to make it a list
    const parsedApprovers = parseStringToList(editedApprovers);
    const parsedRequestors = parseStringToList(editedRequestors);

    const formData = {
      allowed_approvers: parsedApprovers,
      allowed_requestors: parsedRequestors,
      uid: data.uid,
      details: data.details,
      type: data.type,
    }
    //Send to parents
    onUpdate(formData);
    // Toggle off editing mode
    setOnEdit(false);
  };

  // Function to handle the "Cancel" action
  const handleCancel = () => {
    // Reset the edited value to its original value
    setEditedApprovers(data.allowed_approvers);
    setEditedRequestors(data.allowed_requestors);
    // Toggle off editing mode
    setOnEdit(false);
  };

  return (
    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
      <td className="px-6 py-4 whitespace-nowrap">{data.type}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {/* <RequestDetailModal data={data} /> */}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {onEdit ? (
          // Show an input field when editing
          <input
            type="text"
            value={editedApprovers}
            onChange={(e) => setEditedApprovers(e.target.value)}
          />
        ) : (
          // Show the data when not editing
          editedApprovers
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {onEdit ? (
          // Show an input field when editing
          <input
            type="text"
            value={editedRequestors}
            onChange={(e) => setEditedRequestors(e.target.value)}
          />
        ) : (
          // Show the data when not editing
          editedRequestors
        )}
      </td>
      <td>
        {onEdit ? (
          // Show "Update" and "Cancel" buttons when editing
          <>
            <button
              className="px-4 py-2 mr-2 text-white bg-green-500 rounded"
              onClick={handleUpdate}
            >
              Update
            </button>
            <button
              className="px-4 py-2 mr-2 text-white bg-red-500 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </>
        ) : (
          // Show the "Edit" button when not editing
          <button
            className="px-4 py-2 mr-2 text-white bg-blue-500 rounded"
            onClick={() => setOnEdit(true)}
          >
            Edit
          </button>
        )}
      </td>
    </tr>
  );
}
