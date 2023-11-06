import React, { useState } from 'react';

function DropdownMenu({ selectedCompany, onSelectCompany }) {
  // Handling company dropdown
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleButtonClick = (state) => {
    onSelectCompany(state);
    setIsOpen(false); // Close the dropdown when an option is clicked
  };

  // // Getting the list of companies 
  // // Hard coded now
  const [companyDict, setCompanyDict] = useState({
    "company_name": "companyID",
    "test": "testID",
    "bryan": "do your work"
  });
  // // Fetch here

  return (
    <div className="relative inline-block text-left bg-slate-600">
      <button onClick={toggleDropdown} className="px-4 py-2 text-gray-800 border border-gray-300 rounded-md bg-white shadow-sm hover:shadow-md focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
        {selectedCompany || 'Select Company'}
      </button>
      {isOpen && (
        <div className="origin-top-right right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {Object.entries(companyDict).map(([name, id]) => (
              <button
                key={id}
                onClick={() => handleButtonClick(id)}
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
              >
                {name}
              </button>
            ))}


          </div>
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
