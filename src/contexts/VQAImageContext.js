// SearchResultContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context
const VQAImageContext = createContext();

// Create a provider component
export const VQAImageProvider = ({ children }) => {
    const [VQAImage, setVQAImage] = useState([]);

    return (
        <VQAImageContext.Provider value={{ VQAImage, setVQAImage }}>
            {children}
        </VQAImageContext.Provider>
    );
};

// Custom hook to use the SearchImageContext
export const useVQASearchImage = () => {
    return useContext(VQAImageContext);
};
