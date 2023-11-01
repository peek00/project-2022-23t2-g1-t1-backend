import React, { createContext, useState, useContext } from 'react';

// Create the user context
const UserContext = createContext();

// Create a UserContextProvider component to wrap your app
export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  
  });

  const updateUserData = (firstName,lastName,email) => {
    setUserData(
        {
        firstName: firstName,
        lastName: lastName,
        email: email,
      }
    );
  };

  // Provide the user data and update function to the context
  const contextValue = {
    userData,
    updateUserData,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to access the user context
export const useUserContext = () => {
  return useContext(UserContext);
};
