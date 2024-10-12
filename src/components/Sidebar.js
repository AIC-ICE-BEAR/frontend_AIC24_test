import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import SEMPanel from './Panels/SEMPanel';
import OCRPanel from './Panels/OCRPanel';
import ASRPanel from './Panels/ASRPanel';
import VQAPanel from './Panels/VQAPanel';
import TemporalPanel from './Panels/TemporalPanel'
import ObjectDetectionPanel from './Panels/ObjectDetectionPanel';

const SidebarApp = () => {
  const [numImages, setNumImages] = useState(20);
  const [activePanel, setActivePanel] = useState('SEM');

  const renderPanel = () => {
    switch (activePanel) {
      case 'SEM':
        return <SEMPanel numImages={numImages} setNumImages={setNumImages} />;
      case 'TEMP':
        return <TemporalPanel numImages={numImages} setNumImages={setNumImages} />;
      case 'OCRASR':
        return <OCRPanel numImages={numImages} setNumImages={setNumImages} />;
      case 'ASR':
        return <ASRPanel numImages={numImages} setNumImages={setNumImages} />;
      case 'ObjectDetection':
        return <ObjectDetectionPanel numImages={numImages} setNumImages={setNumImages} />;
      case 'VQA':
        return <VQAPanel numImages={numImages} setNumImages={setNumImages} />;
      default:
        return <SEMPanel numImages={numImages} setNumImages={setNumImages} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 ">
      {/* Sidebar */}
      <div className="flex flex-col w-20 border-r border-gray-300">


        <div className="flex flex-col w-20 items-center space-y-2 p-4 ">
          <button
            className={`w-full p-2 text-center rounded ${activePanel === 'SEM' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setActivePanel('SEM')}
          >
            <img className="w-8 p-0.5 rounded-md"
              src={'./imgsearch.png'}
              alt= "">
              
            </img>
          </button>

          <button
            className={`w-full p-2 text-center rounded ${activePanel === 'TEMP' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setActivePanel('TEMP')}
          >
            <img className="w-8 p-0.5 rounded-md"
              src={'./temporalSearch.png'}
              alt= "">
            </img>
          </button>

          <button
            className={`w-full p-2 text-center rounded ${activePanel === 'OCRASR' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setActivePanel('OCRASR')}
          >
            <img className="w-8 p-0.5 rounded-md"
              src={'./OCRimg.png'}
              alt= "">
            </img>
          </button>

          <button
            className={`w-full p-2 text-center rounded ${activePanel === 'ASR' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setActivePanel('ASR')}
          >
            <img className="w-8 p-0.5 rounded-md"
              src={'./audioImg.png'}
              alt= "">
            </img>
          </button>

          <button
            className={`w-full p-2 text-center rounded ${activePanel === 'ObjectDetection' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setActivePanel('ObjectDetection')}
          >
            <img className="w-8 p-0.5 rounded-md"
              src={'./ObjectDetectionIcon.png'}
              alt= "">
            </img>

          </button>

          <button
            className={`w-full p-2 text-center rounded ${activePanel === 'VQA' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setActivePanel('VQA')}
          >
            <img className="w-8 p-0.5 rounded-md"
              src={'./messaging.jpg'}
              alt= "">
            </img>

          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-grow bg-white p-4 ">
        <div className="flex items-center justify-center my-4 gap-2">
          <label>K</label>
          <input type="range" min="1" max="200" value={numImages} onChange={(e) => setNumImages(e.target.value)} />
          <label>{numImages}</label>
        </div>
        {renderPanel()}
      </div>
    </div>
  );
};

export default SidebarApp;
