import React, { useState } from 'react';

export default function CustomSearch({ label, placeholder, defaultInput, setSearch, resetDefaultInput }) {
  const [input, setInput] = useState(defaultInput);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setInput(inputValue);
    setSearch(inputValue); // Pass the updated value to the parent component
  };

  const handleResetClick = () => {
    setInput('');
    setSearch(''); // Reset the value in the parent component
    resetDefaultInput(); // Optionally reset any default input in the parent component
  };

  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex">
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={handleInputChange}
          className="w-full px-3 py-2 mt-1 mr-5 text-sm border border-gray-300 rounded-md"
        />
        <button onClick={handleResetClick}>Reset</button>
      </div>
    </div>
  );
}
