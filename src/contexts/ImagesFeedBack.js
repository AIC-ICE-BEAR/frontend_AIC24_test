// SearchResultContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context
const FeedbackImageContext = createContext();

// Create a provider component
export const FeedbackImageProvider = ({ children }) => {
    const [FBImage, setFBImage] = useState('');

    return (
        <FeedbackImageContext.Provider value={{ FBImage, setFBImage }}>
            {children}
        </FeedbackImageContext.Provider>
    );
};

// Custom hook to use the SearchImageContext
export const useFeedbackImage = () => {
    return useContext(FeedbackImageContext);
};
