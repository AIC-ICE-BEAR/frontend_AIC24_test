// SearchResultContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context
const OCRresultContext = createContext();

// Create a provider component
export const OCRresultProvider = ({ children }) => {
  const [OCRResult, setOCRResult] = useState([]);

  return (
    <OCRresultContext.Provider value={{ OCRResult, setOCRResult }}>
      {children}
    </OCRresultContext.Provider>
  );
};

// Custom hook to use the SearchResultContext
export const useOCRSearchResult = () => {
  return useContext(OCRresultContext);
};
