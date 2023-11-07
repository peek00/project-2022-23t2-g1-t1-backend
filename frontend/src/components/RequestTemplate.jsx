 
export  default function RequestTemplate({requestDetail}) {
    // JS Function come here
    console.log("Here!")
    console.log(requestDetail);
  return (
    <div className="ms-[40px]">
      Form details
      <form className="w-1/2 mx-auto mt-6">
      {Object.entries(requestDetail).map(([fieldName, fieldType]) => {
        let inputField = null;
        if (fieldName == "uid" || fieldName =="companyid" || fieldName == "created_at"){
          inputField;
        }
          else if (fieldType === 'str') {
          inputField = <input type="text" name={fieldName} className="p-2 border" />;
        } else if (fieldType === 'int') {
          inputField = <input type="number" name={fieldName} className="p-2 border" />;
        } else if (fieldType === 'bool') {
          inputField = (
            <input type="checkbox" name={fieldName} className="mr-2" />
          );
        }

        return (
          <div key={fieldName} className="mb-4">
            <label htmlFor={fieldName} className="block font-bold text-gray-700">
              {fieldName}
            </label>
            {inputField}
          </div>
        );
      })}

      <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">
        Submit
      </button>
    </form>
      
    </div>
  );
}


