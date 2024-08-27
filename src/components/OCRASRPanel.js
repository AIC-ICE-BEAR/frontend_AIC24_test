import React, { useState } from 'react';
import Switch from "react-switch";
import { handleKeyPressASR, handleKeyPressOCR } from "./ServicesUtils";
import { useOCRSearchResult } from '../contexts/OCRsearchContext';
import { useASRSearchResult } from '../contexts/ASRsearchContext';
import { useModeContext } from '../contexts/searchModeContext';

const OCRASRPanel = ({ numImages, setNumImages }) => {
  const { setOCRResult } = useOCRSearchResult();
  const { setASRResult } = useASRSearchResult();
  const { setSearchMode } = useModeContext();

  const [ASRquery, setASRquery] = useState('');
  const [OCRquery, setOCRquery] = useState('');
  const [ASRMode, setASRMode] = useState('slow');
  const [isASRModeSwitchChecked, setisASRModeSwitchChecked] = useState(false);

  return (
    <div className="p-4 border-b">
   
      
      <div className="mb-5">
        <p>ASR</p>
        <div className=" flex items-center justify-center my-4 gap-2">
          <label>Slow</label>
          <Switch onChange={() => setisASRModeSwitchChecked(!isASRModeSwitchChecked)} checked={isASRModeSwitchChecked} />
          <label>Fast</label>
        </div>

        <textarea
          className="shadow appearance-none border-2 rounded w-full py-2 px-3"
          placeholder="Fill query and press enter"
          value={ASRquery}
          onChange={(e) => setASRquery(e.target.value)}
          onKeyPress={(e) => handleKeyPressASR(e, ASRquery, ASRMode, numImages, setASRResult, setSearchMode)}
          rows="1"
          style={{ height: 'auto' }}
        />
      </div>

      <div className="mb-5">
        <p>OCR</p>
        <textarea
          className="shadow appearance-none border-2 rounded w-full py-2 px-3"
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

export default OCRASRPanel;
