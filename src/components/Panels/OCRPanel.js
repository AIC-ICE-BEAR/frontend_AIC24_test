import React, { useState } from 'react';
import { handleKeyPressOCR } from "../utils/ServicesUtils";
import { useOCRSearchResult } from '../../contexts/OCRsearchContext';
import Switch from "react-switch";
import { useModeContext } from '../../contexts/searchModeContext';

const OCRPanel = ({ numImages, setNumImages }) => {
  const { setOCRResult } = useOCRSearchResult();

  const { setSearchMode } = useModeContext();


  const [OCRquery, setOCRquery] = useState('');

  const [OCRMode, setOCRMode] = useState('fast');
  const [isOCRModeSwitchChecked, setisOCRModeSwitchChecked] = useState(false);

  const handlemodeSwitch = (checked) => {
    setisOCRModeSwitchChecked(checked);
    setOCRMode(checked ? "elastic" : "fast");
  };



  return (
    <div className="w-64 p-4 border-b">

      <div className="mb-5 ">
        <p>OCR</p>
        <div className="flex items-center justify-center my-4 gap-2">
          <label>slow</label>
          <Switch onChange={handlemodeSwitch} checked={isOCRModeSwitchChecked} />
          <label>elastic</label>
        </div>

        {/* <div className="flex items-center justify-center my-4 gap-2">
          <label>Translate</label>
          <Switch />
        </div> */}
        <textarea
          className="shadow w-full appearance-none border-2 rounded  py-2 px-3"
          placeholder="Fill query and press enter"
          value={OCRquery}
          onChange={(e) => setOCRquery(e.target.value)}
          onKeyPress={(e) => handleKeyPressOCR(e, OCRquery, numImages, OCRMode, setOCRResult, setSearchMode)}
          rows="1"
          style={{ height: 'auto' }}
        />
      </div>
    </div>
  );
};

export default OCRPanel;
