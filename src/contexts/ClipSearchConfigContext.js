// SearchResultContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context
const ClipConfigContext = createContext();

// Create a provider component
export const ClipConfigProvider = ({ children }) => {
  const [ClipConfig, setClipConfig] = useState('');

  return (
    <ClipConfigContext.Provider value={{ ClipConfig, setClipConfig }}>
      {children}
    </ClipConfigContext.Provider>
  );
};

// Custom hook to use the SearchResultContext
export const useClipConfig = () => {
  return useContext(ClipConfigContext);
};
