// SearchResultContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context
const ModeContext = createContext();

// Create a provider component
export const ModeContextProvider = ({ children }) => {
  const [searchMode, setSearchMode] = useState("text");

  return (
    <ModeContext.Provider value={{ searchMode, setSearchMode }}>
      {children}
    </ModeContext.Provider>
  );
};

// Custom hook to use the SearchResultContext
export const useSearchResult = () => {
  return useContext(ModeContext);
};
