import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Clipservice from "../services/ClipService"
import ASRservice from "../services/ASRservice"
import OBDetservice from "../services/OBDetservice"
import OCRservice from "../services/OCRservice"
import { useSearchResult } from '../contexts/ClipsearchContext';
import { useOCRSearchResult } from '../contexts/OCRsearchContext'; 
import { useOBDetResult } from '../contexts/OBDetsearchContext'; 
import {useASRSearchResult} from '../contexts/ASRsearchContext'; 
import { useModeContext } from '../contexts/searchModeContext';
import Switch from "react-switch";


function SidebarApp({ style }) {
  const { setSearchResult } = useSearchResult();
  const { setOBDetResult } = useOBDetResult(); 
  const { setOCRResult } = useOCRSearchResult(); 
  const { setASRResult } = useASRSearchResult(); 
  const [ModelSelect, setModelSelect] = useState('ViT-bigG-14');
  const [numImages, setNumImages] = useState(20);
  const [Textquery, setTextquery] = useState('');
  const [ASRquery, setASRquery] = useState('');
  const [OCRquery, setOCRquery] = useState('');
  const [OBDetquery, setOBDetquery] = useState('');

  const [QueryLanguage, setQueryLanguage] = useState('English');
  const [ObtDetMode, setObtDetMode] = useState('fast');
  const [isLanguageSwitchChecked, setIsLanguageSwitchChecked] = useState(false);
  const [ismodeSwitchChecked, setismodeSwitchChecked] = useState(false);
  const [status, setStatus] = useState({ code: 200, message: 'Accepted' });
  const {searchMode, setSearchMode} = useModeContext(); 


  const handleLanguageSwitch = (checked) => {
    setIsLanguageSwitchChecked(checked);
    setQueryLanguage(checked ? "Eng" : "Vie");
  };

  const handlemodeSwitch = (checked) => {
    setismodeSwitchChecked(checked);
    setObtDetMode(checked ? "fast" : "slow");
  };


  const handleKeyPressCLIP = async  (e) => {
    if (e.key === 'Enter') {
      console.log("send request clip");

      const toastId = toast.loading("Sending request...");
      
      try {
        const response = await Clipservice.sendClipRequest(Textquery, numImages, ModelSelect, QueryLanguage);

        toast.update(toastId, {
          render: "Request successful!",
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });



        setSearchResult(response.data.search_result);
        setSearchMode('text')
        // setStatus({ code: 200, message: "Successful" });
      } catch (error) {
        console.log(error);
        toast.update(toastId, {
          render: `Error: ${error.message || 'Failed'}`,
          type: 'error',
          isLoading: false,
          autoClose: 3000
        });
      }
    }
  };

  const handleKeyPressOCR = async (e) => {
    if (e.key === 'Enter') {
      console.log("send request OCR");

      const toastId = toast.loading("Sending request...");
      
      try {
        const response = await OCRservice.sendOcrRequest(OCRquery, numImages);
        toast.update(toastId, {
          render: "Request successful!",
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });


        setOCRResult(response.data.search_result);
        setSearchMode('text')
        // setStatus({ code: 200, message: "Successful" });
      } catch (error) {
    
        console.log(error);
  
        // Update the toast to error
        toast.update(toastId, {
          render: `Error: ${error.message || 'Failed'}`,
          type: 'error',
          isLoading: false,
          autoClose: 3000
        });
      }
    }
  };

  const handleKeyPressASR = async (e) => {
    if (e.key === 'Enter') {
      console.log("send request ASR");
  
      // Show pending alert
      const toastId = toast.loading("Sending request...");
  
      try {
        const response = await ASRservice.sendASRRequest(ASRquery, numImages);
  
        // Update the toast to success
        toast.update(toastId, {
          render: "Request successful!",
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });
  
        setASRResult(response.data.search_result);
        setSearchMode('asr');
      } catch (error) {
        console.log(error);
  
        // Update the toast to error
        toast.update(toastId, {
          render: `Error: ${error.message || 'Failed'}`,
          type: 'error',
          isLoading: false,
          autoClose: 3000
        });
      }
    }
  };
  


  const handleKeyPressOBDet =  async (e) => {
    if (e.key === 'Enter') {
      console.log("send request OBdet");
      const toastId = toast.loading("Sending request...");
      
      try {
        const response = await OBDetservice.sendOBDetRequest(OBDetquery, numImages, ObtDetMode);


        toast.update(toastId, {
          render: "Request successful!",
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });


        setOBDetResult(response.data.search_result);
        setSearchMode('text')
        // setStatus({ code: 200, message: "Successful" });
      } catch (error) {
        console.log(error);

        toast.update(toastId, {
          render: `Error: ${error.message || 'Failed'}`,
          type: 'error',
          isLoading: false,
          autoClose: 3000
        });
        // setStatus({ code: error.status || 500, message: error.message || 'Failed' });
      }
    }
  };



  const handleChange = (e) => {
    setTextquery(e.target.value);
    autoResize(e);
  };

  const autoResize = (e) => {
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
  };


  

  return (
    <div className="block  overflow-y-auto h-screen" style={style}>
      <label>STATUS</label>
      <div className={`mt-4 p-2 text-center rounded text-white text-lg font-bold ${status.code === 200 ? 'bg-green-500' : 'bg-red-500'}`}>
        {status.message}
      </div>
      <div className="query-controls mb-5">
        <p>TEXT</p>
        <div className="flex items-center gap-8">
          <div>
            {/* Model 1 */ }
            <label>ViT-bigG-14</label>
            <input type="radio" name="queryMode" value="ViT-bigG-14" checked={ModelSelect === 'ViT-bigG-14'} onChange={(e) => setModelSelect(e.target.value)} />
          </div>
          <div>
            {/* Model 2 */ }
            <label>ViT 5b</label>
            <input type="radio" name="queryMode" value="ViT 5b" checked={ModelSelect === 'ViT 5b'} onChange={(e) => setModelSelect(e.target.value)} />
          </div>
          <div>
            {/* Model 3 */ }
            <label>Blip2-ViTG</label>
            <input type="radio" name="queryMode" value="Blip2-ViTG" checked={ModelSelect === 'Blip2-ViTG'} onChange={(e) => setModelSelect(e.target.value)} />
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
          <input type="range" min="1" max="200" value={numImages} onChange={(e) => setNumImages(e.target.value)} />
          <label>{numImages}</label>
        </div>

        {/* CLIP Query text box */}
        <div className=" text-mode-options">
          <textarea
              className="mx-auto h-auto min-h-[5rem] w-60 border-2 border-solid border-black resize-none overflow-hidden"
              placeholder="fill query and press enter"
              value={Textquery}
              onChange={handleChange}
              onKeyPress={handleKeyPressCLIP}
              rows="1"
              style={{ height: 'auto' }}
          />
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
                  onKeyPress={handleKeyPressASR} />
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
                  onKeyPress={handleKeyPressOCR} />
        </div>
      </div>

      <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

      <div className='mb-5'>
        <p>OBJECT DETECTION</p>
        {/* Mode select */}
        <div className="flex items-center justify-center my-4 gap-2">
          <label>Slow</label>
          <Switch onChange={handlemodeSwitch} checked={ismodeSwitchChecked} onColor={'#888'} offColor={'#888'} uncheckedIcon={false} checkedIcon={true} height={20} width={53} />
          <label>Fast</label>
        </div>

        {/* OB detection Query text box */}
        <div className="text-mode-options">
        <input className="mx-auto h-20 w-60 border-2 border-solid border-black" 
                  type="text" 
                  placeholder='fill query and press enter' 
                  value={OBDetquery} onChange={(e) => setOBDetquery(e.target.value)} 
                  onKeyPress={handleKeyPressOBDet} />
        </div>
      </div>
      
    </div>
  );
}

export default SidebarApp;
