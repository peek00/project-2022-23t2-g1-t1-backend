import React, { createContext, useContext, useState } from 'react';

const UserFilterContext = createContext();

export const useUserFilter = () => {
  const context = useContext(UserFilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

export const UserFilterProvider = ({ children }) => {
  const [filteredUsers, setFilteredUsers] = useState('');

  const updateFilteredUsers = (text) => {
    setFilteredUsers(text);
  };

  return (
    <UserFilterContext.Provider value={{ filterText, updateFilter }}>
      {children}
    </UserFilterContext.Provider>
  );
};
