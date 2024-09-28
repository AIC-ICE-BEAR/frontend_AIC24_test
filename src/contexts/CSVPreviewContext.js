// SearchResultContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context
const CSVPreviewContext = createContext();

// Create a provider component
export const CSVPreviewProvider = ({ children }) => {
    const [submittedImages, setsubmittedImages] = useState([])
    return (
        <CSVPreviewContext.Provider value={{ submittedImages, setsubmittedImages }}>
            {children}
        </CSVPreviewContext.Provider>
    );
};

// Custom hook to use the SearchImageContext
export const useCSVPreview = () => {
    return useContext(CSVPreviewContext);
};
