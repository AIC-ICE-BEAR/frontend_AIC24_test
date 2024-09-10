// SearchResultContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context
const VQAResultContext = createContext();

// Create a provider component
export const VQAResultProvider = ({ children }) => {
    const [VQAResult, setVQAResult] = useState([]);

    return (
        <VQAResultContext.Provider value={{ VQAResult, setVQAResult }}>
            {children}
        </VQAResultContext.Provider>
    );
};

// Custom hook to use the SearchResultContext
export const useVQASearchResult = () => {
    return useContext(VQAResultContext);
};
