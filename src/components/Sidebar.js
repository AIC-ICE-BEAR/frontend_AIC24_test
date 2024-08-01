import React, { useState } from 'react';
import axios from 'axios';
import Clipservice from "../services/ClipService"
import { useSearchResult } from '../contexts/ClipsearchContext';
import { useModeContext } from '../contexts/searchModeContext';
import Switch from "react-switch";
import Divider from '@mui/material/Divider';

function SidebarApp({ style }) {
  const { setSearchResult } = useSearchResult();
  const [ModelSelect, setModelSelect] = useState('CLIP 5B');
  const [numImages, setNumImages] = useState(20);
  const [Textquery, setTextquery] = useState('');
  const [ASRquery, setASRquery] = useState('');
  const [OCRquery, setOCRquery] = useState('');

  const [QueryLanguage, setQueryLanguage] = useState('English');
  const [isLanguageSwitchChecked, setIsLanguageSwitchChecked] = useState(false);
  const [status, setStatus] = useState({ code: 200, message: 'Accepted' });
  const {searchMode, setSearchMode} = useModeContext(); 
  const handleLanguageSwitch = (checked) => {
    setIsLanguageSwitchChecked(checked);
    setQueryLanguage(checked ? "Eng" : "Vie");
  };

 

  const sendrequets_clip = async () => {
    console.log("send request");
    setSearchMode('text')
    try {
      const response = await Clipservice.sendClipRequest(Textquery, numImages, ModelSelect, QueryLanguage);
      setSearchResult(response.data.search_result);
      // setStatus({ code: 200, message: "Successful" });
    } catch (error) {
      console.log(error);
      // setStatus({ code: error.status || 500, message: error.message || 'Failed' });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendrequets_clip();
    }
  };

  const sendrequets_ocr = async (e) => {
    if (e.key === 'Enter') {
      console.log("send request")
      setSearchMode('text')
      try {
        const response = await axios.post('http://localhost:8000/search_OCR', {"query": [OCRquery], "k": numImages});
        console.log(response.data);
    
    } catch (error) {
        if (error.response) {
            alert(`Search failed: ${error.response.data.detail}`);
        } else {
            alert('failed: Network error');
        }
    }
    }
    
  };



  const sendrequets_asr = async (e) => {
    if (e.key === 'Enter') {
      console.log("send request")
      setSearchMode('asr')
      try {
        const response = await axios.post('http://localhost:8000/search_OCR', {"query": [OCRquery], "k": numImages});
        console.log(response.data);
    
    } catch (error) {
        if (error.response) {
            alert(`Search failed: ${error.response.data.detail}`);
        } else {
            alert('failed: Network error');
        }
    }
    }
    
  };

  return (
    <div className="block" style={style}>
      <div className="query-controls mb-5">
        <p>TEXT</p>
        <div className="flex items-center gap-8">
          <div>
            {/* Model 1 */ }
            <label>CLIP 5B</label>
            <input type="radio" name="queryMode" value="CLIP 5B" checked={ModelSelect === 'CLIP 5B'} onChange={(e) => setModelSelect(e.target.value)} />
          </div>
          <div>
            {/* Model 2 */ }
            <label>ViT-bigG-14</label>
            <input type="radio" name="queryMode" value="ViT-bigG-14" checked={ModelSelect === 'ViT-bigG-14'} onChange={(e) => setModelSelect(e.target.value)} />
          </div>
          <div>
            {/* Model 3 */ }
            <label>BLIP 2</label>
            <input type="radio" name="queryMode" value="BLIP 2" checked={ModelSelect === 'BLIP 2'} onChange={(e) => setModelSelect(e.target.value)} />
          </div>
        </div>

        {/* Language select */}
        <div className="flex items-center justify-center my-4 gap-2">
          <label>Vie</label>
          <Switch onChange={handleLanguageSwitch} checked={isLanguageSwitchChecked} onColor={'#888'} offColor={'#888'} uncheckedIcon={false} checkedIcon={true} height={20} width={53} />
          <label>Eng</label>
        </div>

        {/* Top K images */}
        <div className="flex items-center justify-center my-4 gap-2">
          <label>K</label>
          <input type="range" min="1" max="100" value={numImages} onChange={(e) => setNumImages(e.target.value)} />
          <label>{numImages}</label>
        </div>

        {/* CLIP Query text box */}
        <div className=" text-mode-options">
          <input className="mx-auto h-20 w-60 border-2 border-solid border-black" 
                  type="text" 
                  placeholder='fill query and press enter' 
                  value={Textquery } onChange={(e) => setTextquery(e.target.value)} 
                  onKeyPress={handleKeyPress} />
        </div>
      </div>
      <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
      <div className='mb-5'>
        <p>ASR</p>
        {/* ASR Query text box */}
        <div className="text-mode-options">
        <input className="mx-auto h-20 w-60 border-2 border-solid border-black" 
                  type="text" 
                  placeholder='fill query and press enter' 
                  value={ASRquery } onChange={(e) => setASRquery(e.target.value)} 
                  onKeyPress={handleKeyPress} />
        </div>
      </div>

      <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
     
      <div className='mb-5'>
        <p>OCR</p>
        {/* OCR Query text box */}
        <div className="text-mode-options">
        <input className="mx-auto h-20 w-60 border-2 border-solid border-black" 
                  type="text" 
                  placeholder='fill query and press enter' 
                  value={OCRquery } onChange={(e) => setOCRquery(e.target.value)} 
                  onKeyPress={handleKeyPress} />
        </div>
      </div>
      <div className={`mt-4 p-2 text-center rounded text-white text-lg font-bold ${status.code === 200 ? 'bg-green-500' : 'bg-red-500'}`}>
        {status.message}
      </div>
    </div>
  );
}

export default SidebarApp;
