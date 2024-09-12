import React, { useState, useEffect } from 'react';
import Switch from "react-switch";
import { handleKeyPressCLIP } from "../utils/ServicesUtils";
import { handleKeyPressFused } from "../utils/ServicesUtils";
import { useSearchResult } from '../../contexts/ClipsearchContext';
import { useModeContext } from '../../contexts/searchModeContext';
import { useClipConfig } from '../../contexts/ClipSearchConfigContext';

const SEMPanel = ({ numImages, setNumImages }) => {
  const { setSearchResult } = useSearchResult();
  const { setSearchMode } = useModeContext();
  const { ClipConfig, setClipConfig } = useClipConfig();

  const [ModelSelect, setModelSelect] = useState('ViT-bigG-2B');
  const [Textquery, setTextquery] = useState('');
  const [textquerylist, settextquerylist] = useState(['']); // Initialize with primary Textquery
  const [QueryLanguage, setQueryLanguage] = useState('Eng');
  const [isLanguageSwitchChecked, setIsLanguageSwitchChecked] = useState(false);

  const handleLanguageSwitch = (checked) => {
    setIsLanguageSwitchChecked(checked);
    setQueryLanguage(checked ? "Vie" : "Eng");
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setTextquery(newValue);
    autoResize(e);
    updateFirstTextQueryList(newValue); // Synchronize the first query
  };

  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const updateFirstTextQueryList = (newValue) => {
    const newTextQueryList = [...textquerylist];
    newTextQueryList[0] = newValue; // Update the first entry in the list
    settextquerylist(newTextQueryList);
  };

  const handleChangeMultiQuery = (index, value) => {
    const newTextQueryList = [...textquerylist];
    newTextQueryList[index] = value;
    settextquerylist(newTextQueryList);

    // Synchronize primary Textquery if the first entry is changed
    if (index === 0) {
      setTextquery(value);
    }
  };

  useEffect(() => {
    setClipConfig(ModelSelect + "#" + numImages);
    console.log("Clip config", ClipConfig);
  }, [ModelSelect, numImages]);

  const handleMuliQueryPress = (e, query) => {
    // Clean the query before handling key press
    const cleanedQuery = query.trim().replace(/\s+/g, ' ');
    handleKeyPressCLIP(e, cleanedQuery, numImages, ModelSelect, QueryLanguage, setSearchResult, setSearchMode);
  };

  const addQueryBox = () => {
    settextquerylist([...textquerylist, '']); // Add new empty query box
  };

  const handleRemove = (index) => {
    if (index === 0) {
      setTextquery(''); // Clear the main Textquery when the first item is removed
    }
    const newTextQueryList = textquerylist.filter((_, i) => i !== index);
    settextquerylist(newTextQueryList);
  };

  return (
    <div className="p-4 border-b ">
      <div className="query-controls mb-5">
        <p>TEXT</p>
        <div className="flex justify-center gap-8">
          <div>
            <label>ViT-bigG-2B</label>
            <input
              type="radio"
              value="ViT-bigG-2B"
              checked={ModelSelect === 'ViT-bigG-2B'}
              onChange={(e) => setModelSelect(e.target.value)}
            />
          </div>
          <div>
            <label>ViT 5b</label>
            <input
              type="radio"
              value="ViT 5b"
              checked={ModelSelect === 'ViT 5b'}
              onChange={(e) => setModelSelect(e.target.value)}
            />
          </div>
          <div>
            <label>Clip-400M</label>
            <input
              type="radio"
              value="Clip-400M"
              checked={ModelSelect === 'Clip-400M'}
              onChange={(e) => setModelSelect(e.target.value)}
            />
          </div>
        </div>
        {/* For VBS */}
        <div className="flex items-center justify-center my-4 gap-2">
          <label>Translate</label>
          <Switch onChange={handleLanguageSwitch} checked={isLanguageSwitchChecked} />
          <label></label>
        </div>

        {/* <div className="flex items-center justify-center my-4 gap-2">
          <label>Eng</label>
          <Switch onChange={handleLanguageSwitch} checked={isLanguageSwitchChecked} />
          <label>Vie</label>
        </div> */}

        {textquerylist.map((query, index) => (
          <div key={index} className="flex items-start gap-2 mb-2">
            <textarea
              className="shadow appearance-none border-2 rounded w-full py-2 px-3 flex-grow"
              placeholder={`${index === 0 ? "Describe then scene" : "Describe what happens next"} `}
              value={query}
              onChange={(e) => handleChangeMultiQuery(index, e.target.value)}
              onKeyPress={(e) => {
                // Clean text before handling key press
                const cleanedText = query.trim().replace(/\s+/g, ' ');

                if (textquerylist.length > 1) {
                  handleKeyPressFused(e, textquerylist.map(q => q.trim().replace(/\s+/g, ' ')), numImages, ModelSelect, setSearchResult, setSearchMode);
                  setClipConfig(ModelSelect + "#" + numImages);
                } else {
                  handleKeyPressCLIP(e, cleanedText, numImages, ModelSelect, QueryLanguage, setSearchResult, setSearchMode);
                  setClipConfig(ModelSelect + "#" + numImages);
                }
              }}
              rows="1"
              style={{ height: 'auto' }}
            />
            <button
              onClick={() => handleRemove(index)}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
            >
              -
            </button>
          </div>
        ))}

        <button
          onClick={addQueryBox}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default SEMPanel;
