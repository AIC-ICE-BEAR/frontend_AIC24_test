// SearchResultContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context
const OBDetResultContext = createContext();

// Create a provider component
export const OBDetResultProvider = ({ children }) => {
  const [OBDetResult, setOBDetResult] = useState([]);

  return (
    <OBDetResultContext.Provider value={{ OBDetResult, setOBDetResult }}>
      {children}
    </OBDetResultContext.Provider>
  );
};

// Custom hook to use the SearchResultContext
export const useOBDetResult = () => {
  return useContext(OBDetResultContext);
};
