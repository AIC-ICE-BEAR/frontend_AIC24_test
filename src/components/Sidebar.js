import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import SEMPanel from './Panels/SEMPanel';
import OCRASRPanel from './Panels/OCRASRPanel';
import ObjectDetectionPanel from './Panels/ObjectDetectionPanel';

const SidebarApp = () => {
  const [numImages, setNumImages] = useState(20);

  const [activePanel, setActivePanel] = useState('SEM');



  const renderPanel = () => {
    switch (activePanel) {
      case 'SEM':
        return <SEMPanel numImages={numImages} setNumImages={setNumImages} />;
      case 'OCRASR':
        return <OCRASRPanel numImages={numImages} setNumImages={setNumImages} />;
      case 'ObjectDetection':
        return <ObjectDetectionPanel numImages={numImages} setNumImages={setNumImages} />;
      default:
        return <SEMPanel numImages={numImages} setNumImages={setNumImages} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 border-4 border-separate w-[20%]">
      {/* Sidebar */}
      <div className="w-full border-r  justify-start ">
        <div className="flex items-center justify-center my-4 gap-2">
          <label>K</label>
          <input type="range" min="1" max="200" value={numImages} onChange={(e) => setNumImages(e.target.value)} />
          <label>{numImages}</label>
        </div>

        <div className="flex p-4">
          <button
            className={`w-full p-2 text-center rounded mb-2 ${activePanel === 'SEM' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActivePanel('SEM')}
          >
            SEM
          </button>
          <button
            className={`w-full p-2 text-center rounded mb-2 ${activePanel === 'OCRASR' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActivePanel('OCRASR')}
          >
            OCR & ASR
          </button>
          <button
            className={`w-full p-2 text-center rounded ${activePanel === 'ObjectDetection' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActivePanel('ObjectDetection')}
          >
            Object Detection
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-grow bg-white p-4">
        {renderPanel()}
      </div>
    </div>
  );
};

export default SidebarApp;