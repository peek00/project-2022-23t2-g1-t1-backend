import React, { useState, useEffect} from 'react';
import {API_BASE_URL} from "@/config/config";
import axios from 'axios';

function DropdownMenu({ selectedCompany, onSelectCompany }) {
  // Handling company dropdown
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleButtonClick = (state) => {
    onSelectCompany(state);
    setIsOpen(false); // Close the dropdown when an option is clicked
    localStorage.setItem('selectedCompany', state);
    window.dispatchEvent(new Event("storage"));
  };
  const [companyList, setCompanyList] = useState([ ]);

  // Read the selectedCompany from local storage during initialization
  // Read the selectedCompany from local storage and fetch company list from the API during initialization
  useEffect(() => {
    const storedCompany = localStorage.getItem('selectedCompany');
    if (storedCompany) {
      onSelectCompany(storedCompany);
    }

    // Fetch company list from the API
    axios.get(
      API_BASE_URL + '/api/points/allcompanyids',
      {
        withCredentials: true,
      })
      .then((response) => {
        setCompanyList(response.data.data);
      })
  }, [onSelectCompany]); // Adding onSelectCompany as a dependency


  return (
    <div className="relative inline-block mb-5 text-left bg-slate-600">
      <button onClick={toggleDropdown} className="px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm ms-3 hover:shadow-md focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
        {selectedCompany || 'Select Company'}
      </button>
      {isOpen && (
        <div className="right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {companyList.map((name) => (
              <button
                key={name}
                onClick={() => handleButtonClick(name)}
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
