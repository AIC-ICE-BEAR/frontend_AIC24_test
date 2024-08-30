import React, { useState } from 'react';
import { handleKeyPressOCR } from "../utils/ServicesUtils";
import { useOCRSearchResult } from '../../contexts/OCRsearchContext';

import { useModeContext } from '../../contexts/searchModeContext';

const OCRPanel = ({ numImages, setNumImages }) => {
  const { setOCRResult } = useOCRSearchResult();

  const { setSearchMode } = useModeContext();


  const [OCRquery, setOCRquery] = useState('');


  return (
    <div className="w-64 p-4 border-b">

      <div className="mb-5 ">
        <p>OCR</p>
        <textarea
          className="shadow w-full appearance-none border-2 rounded  py-2 px-3"
          placeholder="Fill query and press enter"
          value={OCRquery}
          onChange={(e) => setOCRquery(e.target.value)}
          onKeyPress={(e) => handleKeyPressOCR(e, OCRquery, numImages, setOCRResult, setSearchMode)}
          rows="1"
          style={{ height: 'auto' }}
        />
      </div>
    </div>
  );
};

export default OCRPanel;
