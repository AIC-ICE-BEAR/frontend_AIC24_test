// SearchResultContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context
const SubmitContext = createContext();

// Create a provider component
export const SubmitProvider = ({ children }) => {
  const [Submission , setSubmission] = useState({});

  return (
    <SubmitContext.Provider value={{ Submission , setSubmission }}>
      {children}
    </SubmitContext.Provider>
  );
};

// Custom hook to use the SearchResultContext
export const useSubmitContext = () => {
  return useContext(SubmitContext);
};
