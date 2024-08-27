import React, { useState, useEffect } from 'react';
import Autocomplete from 'react-autocomplete';
import { handleKeyPressOBDet } from "./ServicesUtils";
import { useOBDetResult } from '../contexts/OBDetsearchContext';
import { useModeContext } from '../contexts/searchModeContext';
import { useClipConfig } from '../contexts/ClipSearchConfigContext'
import Switch from "react-switch";

const ObjectDetectionPanel = ({ numImages, setNumImages }) => {
  const { setOBDetResult } = useOBDetResult();
  const { setSearchMode } = useModeContext();
  const { setClipConfig} = useClipConfig(); 
  const [OBDetquery, setOBDetquery] = useState('');
  const [autocompleteValue, setAutocompleteValue] = useState('');
  const [items, setitems] = useState([]); // Load items as before
  const [ObtDetMode, setObtDetMode] = useState('slow');
  const [ismodeSwitchChecked, setismodeSwitchChecked] = useState(false);



  useEffect(() => {
    // Simulate fetching from an external source
    fetch('/class_names.json') // Replace with the correct path
      .then((response) => response.json())
      .then((data) => {
        setitems(data);
      })
      .catch((error) => console.error('Error loading items:', error));
  }, []); 


  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handlemodeSwitch = (checked) => {
    setismodeSwitchChecked(checked);
    setObtDetMode(checked ? "fast" : "slow");
  };



  const handleInputChange = (e) => {
    setOBDetquery(e.target.value);
    const lastpart = e.target.value.split(' ').pop();
    const lastWord = lastpart.split('-').pop();
    setAutocompleteValue(lastWord);
  };

  const handleSelect = (value) => {
    const parts = OBDetquery.split(' ');
    const lastInstance = parts[parts.length - 1];
    const splatsRemove = lastInstance.split('-');
    splatsRemove[1] = value;
    const newLastValue = `${splatsRemove.join('-')}`;
    parts[parts.length - 1] = newLastValue;
    const newValue = `${parts.join(' ')}`;
    setOBDetquery(newValue);
  };

  const getSuggestions = (value) => {
    const input = value.trim();
    if (input.length === 0) return [];
    return items.filter(item => item.name.includes(input));
  };

  return (
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
    </div>
  );
};

export default ObjectDetectionPanel;
