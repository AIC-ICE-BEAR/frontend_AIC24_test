// SearchResultContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context
const SearchResultContext = createContext();

// Create a provider component
export const SearchResultProvider = ({ children }) => {
  const [searchResult, setSearchResult] = useState([]);

  return (
    <SearchResultContext.Provider value={{ searchResult, setSearchResult }}>
      {children}
    </SearchResultContext.Provider>
  );
};

// Custom hook to use the SearchResultContext
export const useSearchResult = () => {
  return useContext(SearchResultContext);
};
