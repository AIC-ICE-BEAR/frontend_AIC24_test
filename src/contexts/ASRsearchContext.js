// SearchResultContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context
const ASRResultContext = createContext();

// Create a provider component
export const ASRResultProvider = ({ children }) => {
  const [ASRResult, setASRResult] = useState([]);

  return (
    <ASRResultContext.Provider value={{ ASRResult, setASRResult }}>
      {children}
    </ASRResultContext.Provider>
  );
};

// Custom hook to use the SearchResultContext
export const useASRSearchResult = () => {
  return useContext(ASRResultContext);
};
