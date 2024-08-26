import React, { useState , useEffect} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Autocomplete from 'react-autocomplete';

import {handleKeyPressCLIP, handleKeyPressOCR,handleKeyPressASR, handleKeyPressOBDet} from "./ServicesUtils"
import { useSearchResult } from '../contexts/ClipsearchContext';
import { useOCRSearchResult } from '../contexts/OCRsearchContext'; 
import { useOBDetResult } from '../contexts/OBDetsearchContext'; 
import {useASRSearchResult} from '../contexts/ASRsearchContext'; 
import { useModeContext } from '../contexts/searchModeContext';
import {useClipConfig} from '../contexts/ClipSearchConfigContext'
import {useSubmitContext} from '../contexts/SubmitImageContext'; 

import Switch from "react-switch";


function SidebarApp({ style }) {
  const { setSearchResult } = useSearchResult();
  const { setOBDetResult } = useOBDetResult(); 
  const { setOCRResult } = useOCRSearchResult(); 
  const { setASRResult } = useASRSearchResult(); 
  const {Submission} = useSubmitContext(); 
  const [ModelSelect, setModelSelect] = useState('ViT-bigG-14');
  const [numImages, setNumImages] = useState(20);
  const [Textquery, setTextquery] = useState('');
  const [ASRquery, setASRquery] = useState('');
  const [OCRquery, setOCRquery] = useState('');
  const [OBDetquery, setOBDetquery] = useState('');
  const { setClipConfig} = useClipConfig(); 
  //for the autocomplete

  const [items, setitems] = useState([]); 



  const [QueryLanguage, setQueryLanguage] = useState('Eng');
  const [ObtDetMode, setObtDetMode] = useState('slow');
  const [ASRMode, setASRMode] = useState('slow');
  const [isLanguageSwitchChecked, setIsLanguageSwitchChecked] = useState(false);
  const [isASRModeSwitchChecked, setisASRModeSwitchChecked] = useState(false);
  const [ismodeSwitchChecked, setismodeSwitchChecked] = useState(false);
  const [status] = useState({ code: 200, message: 'Accepted' });
  const {setSearchMode} = useModeContext(); 


  const [autocompleteValue, setAutocompleteValue] = useState('');


  // for submission visualization 
  const [submissionList, setsubmissionList] = useState([]); 


  const handleLanguageSwitch = (checked) => {
    setIsLanguageSwitchChecked(checked);
    setQueryLanguage(checked ? "Vie" : "Eng");
  };

  const handlemodeSwitch = (checked) => {
    setismodeSwitchChecked(checked);
    setObtDetMode(checked ? "fast" : "slow");
  };

  const handleASRmodeSwitch = (checked) => {
    setisASRModeSwitchChecked(checked);
    setASRMode(checked ? "fast" : "slow");
  };


  // for the autocomplete

  useEffect(() => {
    // Simulate fetching from an external source
    fetch('/class_names.json') // Replace with the correct path
      .then((response) => response.json())
      .then((data) => {
        setitems(data);
      })
      .catch((error) => console.error('Error loading items:', error));
  }, []); 


  useEffect(() => {
  
    const exists = submissionList.some(
      (submission) =>
        submission.videoName === Submission.videoName && submission.frameIdx === Submission.frameIdx
    );

    if (!exists) {
      setsubmissionList([...submissionList, Submission]);
    }
  }, [Submission, submissionList]);



  const handleInputChange = (e) => {

    setOBDetquery(e.target.value);
    const lastpart = e.target.value.split(' ').pop();
    const lastWord = lastpart.split('-').pop()

    setAutocompleteValue(lastWord);
  };

  const handleSelect = (value) => {
    const parts = OBDetquery.split(' ');
    const lastInstance =  parts[parts.length - 1];
    const splatsRemove = lastInstance.split('-')
    splatsRemove[1]= value 
    const newLastValue = `${splatsRemove.join('-')}`
    parts[parts.length - 1] = newLastValue
    const newValue = `${parts.join(' ')}`
    setOBDetquery(newValue);
  };

  const getSuggestions = (value) => {

    const input = value.trim();
    if (input.length === 0) {
      return [];
    }
  
    return items.filter(item => item.name.includes(input));
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
            <input type="radio" className="queryMode " value="ViT-bigG-14" checked={ModelSelect === 'ViT-bigG-14'} onChange={(e) => setModelSelect(e.target.value)} />
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
          <label>Eng</label>
          <Switch onChange={handleLanguageSwitch} checked={isLanguageSwitchChecked} onColor={'#888'} offColor={'#888'} uncheckedIcon={false} checkedIcon={true} height={20} width={53} />
          <label>Vie</label>
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
              class="shadow appearance-none border-2 rounded border-black w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="fill query and press enter seperated in # "
              value={Textquery}
              onChange={handleChange}
              onKeyPress={(e) => {
                handleKeyPressCLIP(e, Textquery, numImages, ModelSelect, QueryLanguage, setSearchResult, setSearchMode)
                setClipConfig(ModelSelect + "#" + numImages)
              }}
              rows="1"
              style={{ height: 'auto' }}
          />
        </div>
      </div>
      <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
      <div className='mb-5'>
        <p>ASR</p>
        {/* ASR Query text box */}
        {/* Mode select */}
        <div className="flex items-center justify-center my-4 gap-2">
          <label>Slow</label>
          <Switch onChange={handleASRmodeSwitch} checked={isASRModeSwitchChecked} onColor={'#888'} offColor={'#888'} uncheckedIcon={false} checkedIcon={true} height={20} width={53} />
          <label>Fast</label>
        </div>

        <div className=" text-mode-options">
          <textarea
              class="shadow appearance-none border-2 rounded border-black w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="fill query and press enter "
              value={ASRquery }
              onChange={(e) => {

                setASRquery(e.target.value)
                autoResize(e);}}
                onKeyPress={(e) => {
                  handleKeyPressASR(e, ASRquery, ASRMode, numImages, setASRResult, setSearchMode)
                  setClipConfig(ModelSelect + "#" + numImages)
                }}
              rows="1"
              style={{ height: 'auto' }}
          />
        </div>

      
      </div>

      <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
     
      <div className='mb-5'>
        <p>OCR</p>
        {/* OCR Query text box */}
        

        <div className=" text-mode-options">
          <textarea
              class="shadow appearance-none border-2 rounded border-black w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="fill query and press enter"
              value={OCRquery }
              onChange={(e) => {

                setOCRquery(e.target.value)
                autoResize(e);}}
                onKeyPress={(e) => {
                  handleKeyPressOCR(e, OCRquery, numImages, setOCRResult, setSearchMode)
                  setClipConfig(ModelSelect + "#" + numImages)
                }}
              rows="1"
              style={{ height: 'auto' }}
          />
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
        <div className=" text-mode-options" 
             onKeyPress={(e) => {
              handleKeyPressOBDet(e, OBDetquery, numImages, ObtDetMode, setOBDetResult, setSearchMode)
              setClipConfig(ModelSelect + "#" + numImages)
             }}
             onChange={(e) => {
              autoResize(e);
            }}>
          <Autocomplete
              getItemValue={(item) => item.name}
              items={getSuggestions(autocompleteValue)}
              renderItem={(item, isHighlighted) =>
                <div 
                  key={item.id} 
                  className={`px-4 py-2 cursor-pointer ${isHighlighted ? 'bg-gray-200' : 'bg-white'}`}
                >
                  {item.name}
                </div>
              }
              value={OBDetquery}
              onChange={(e) => {
                handleInputChange(e)
                autoResize(e);
              }}
              onSelect={(val) => handleSelect(val)}
              inputProps={{
                className: "shadow appearance-none border-2 rounded border-black w-80 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
                placeholder: "Enter queries like '2 person 1 car'",
              }}
              menuStyle={{
                className: 'absolute left-0 right-0 bg-white shadow-lg max-h-10 overflow-y-auto z-10 rounded-lg border border-gray-200',
              }}
            />
        </div>

            
        {/* Submission list */}
        <div className="overflow-x-auto pt-10">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">Video Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Frame Index</th>
              </tr>
            </thead>
            <tbody>
              {submissionList.map((submission, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{submission.videoName}</td>
                  <td className="border border-gray-300 px-4 py-2">{submission.frameIdx}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
          
          

       
        

        
      </div>
      
    </div>
  );
}

export default SidebarApp;
