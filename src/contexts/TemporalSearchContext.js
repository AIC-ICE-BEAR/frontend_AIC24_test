// SearchResultContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context
const TemporalResultContext = createContext();

// Create a provider component
export const TemporalResultProvider = ({ children }) => {
    const [TemporalResult, setTemporalResult] = useState([]);

    return (
        <TemporalResultContext.Provider value={{ TemporalResult, setTemporalResult }}>
            {children}
        </TemporalResultContext.Provider>
    );
};

// Custom hook to use the SearchResultContext
export const useTemporalSearchResult = () => {
    return useContext(TemporalResultContext);
};
