export default function RequestTemplate({ requestDetail, onSubmit, selectedCompany }) {
  // JS Function come here
  const formDetails = requestDetail["details"];
  const approvers = requestDetail["allowed_approvers"];
  console.log(requestDetail);
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = { request_details: {} }; // Initialize formData object

    Object.entries(formDetails).forEach(([fieldName, fieldType]) => {
      const inputElement = document.querySelector(`[name=${fieldName}]`);
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
    <div className="ms-[40px]">
      Make a <span className="font-bold ">{requestDetail["type"]}</span> request.<br></br>
      This request can only be approved by <span className="font-bold ">{approvers}</span>.<br></br>
      This request is being made for company <span className="font-bold ">{selectedCompany}</span>.
      <form className="w-1/2 mx-auto mt-6" onSubmit={handleSubmit}>
        {Object.entries(formDetails).map(([fieldName, fieldType]) => {
          let inputField = null;
          if (fieldType == "str") {
            inputField = (
              <input type="text" name={fieldName} className="p-2 border" />
            );
          } else if (fieldType === "email") {
            inputField = (
              <input type="email" name={fieldName} className="p-2 border" />
            );
          } else if (fieldType === "int" || fieldType === "float") {
            inputField = (
              <input type="number" name={fieldName} className="p-2 border" />
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
                className="block mr-2 font-bold text-gray-700"
              >
                {fieldName}
              </label>
              {inputField}
            </div>
          );
        })}

        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Submit request. 
        </button>
      </form>
    </div>
  );
}
