import React, { useState, useEffect } from 'react';
import Switch from "react-switch";
import { handleKeyPressCLIP } from "../utils/ServicesUtils";
import { handleKeyPressFused } from "../utils/ServicesUtils";
import { handleKeyPressTranslate } from '../utils/ServicesUtils'
import { useSearchResult } from '../../contexts/ClipsearchContext';
import { useModeContext } from '../../contexts/searchModeContext';
import { useClipConfig } from '../../contexts/ClipSearchConfigContext';
import { useFeedbackImage } from '../../contexts/ImagesFeedBack'

const SEMPanel = ({ numImages, setNumImages }) => {
  const { setSearchResult } = useSearchResult();
  const { setSearchMode } = useModeContext();
  const { ClipConfig, setClipConfig } = useClipConfig();

  const [ModelSelect, setModelSelect] = useState('ViT-bigG-2B');
  const [Textquery, setTextquery] = useState('');
  const [textquerylist, settextquerylist] = useState(['']); // Initialize with primary Textquery
  const [QueryLanguage, setQueryLanguage] = useState('Eng');
  const [isLanguageSwitchChecked, setIsLanguageSwitchChecked] = useState(false);
  const { FBImage, setFBImage } = useFeedbackImage();
  const [SplitMode, setSplitMode] = useState(false);
  const [isSplitSwitchChecked, setisSplitSwitchChecked] = useState(false);



  const handleLanguageSwitch = (checked) => {
    setIsLanguageSwitchChecked(checked);
    setQueryLanguage(checked ? "Vie" : "Eng");
  };

  const handleSplitSwitch = (checked) => {
    setisSplitSwitchChecked(checked);
    setSplitMode(checked ? true : false);
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

    if (!(FBImage === '')) {
      const newTextQueryList = [...textquerylist, FBImage];
      settextquerylist(newTextQueryList);
      setFBImage('')
    }

  }, [FBImage])

  useEffect(() => {
    setClipConfig(ModelSelect + "#" + numImages);

  }, [ModelSelect, numImages]);


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
    <div className="p-4 border-b w-80 max-h-full overflow-y-auto">
      <div className="query-controls mb-5">
        <p>TEXT</p>
        <div className="query-controls mb-5">

          <div className="flex flex-col pt-5 justify-center gap-2">
            <p>Model select</p>
            <select
              id="modelSelect"
              value={ModelSelect}
              onChange={(e) => setModelSelect(e.target.value)}
              className="border border-black rounded p-4 text-sm"
            >
              <option value="ViT-bigG-2B">ViT-bigG-2B</option>
              <option value="ViT 5b">ViT 5b</option>
              <option value="Clip-400M">Clip-400M</option>
            </select>
          </div>
        </div>

        {/* For VBS */}
        <div className="flex items-center justify-center my-4 gap-2">
          <label>Translate</label>
          <Switch onChange={handleLanguageSwitch} checked={isLanguageSwitchChecked} />
        </div>


        <div className="flex items-center justify-center my-4 gap-2">
          <label>Split query</label>
          <Switch onChange={handleSplitSwitch} checked={isSplitSwitchChecked} />
        </div>


        <p className="p-5">Enter here</p>

        {textquerylist.map((query, index) => (
          <div key={index} className="flex items-start gap-2 mb-2">
            <textarea
              className="shadow appearance-none border-2 rounded w-full py-2 px-3 flex-grow"
              placeholder={`${index === 0 ? "Describe the scene" : "Describe what happens next"} `}
              value={query}
              onChange={(e) =>
                handleChangeMultiQuery(index, e.target.value)}
              onKeyPress={async (e) => {

                if (e.key === "Enter") {
                  e.preventDefault()
                }
                // Clean text before handling key press
                const cleanedText = query.trim().replace(/\s+/g, ' ');

                if (textquerylist.length > 1 || SplitMode === true) {
                  if (QueryLanguage === "Vie") {
                    if (e.key === 'Enter') {
                      // Filter out queries that start with +f or -f for translation, but keep them for fused handling
                      // const queriesToTranslate = textquerylist.filter(q => !q.startsWith('+f') && !q.startsWith('-f'));
                      // const Translated = await handleKeyPressTranslate(e, queriesToTranslate);

                      // const mergedQueries = textquerylist.map(q =>
                      //   q.startsWith('+f') || q.startsWith('-f') ? q : Translated.shift().trim().replace(/\s+/g, ' ')
                      // );

                      handleKeyPressFused(e, textquerylist, numImages, QueryLanguage, ModelSelect, setSearchResult, setSearchMode, SplitMode);
                    }
                  } else {
                    if (e.key === 'Enter') {
                      handleKeyPressFused(e, textquerylist.map(q => q.trim().replace(/\s+/g, ' ')), numImages, ModelSelect, setSearchResult, setSearchMode, SplitMode);
                    }
                  }

                  setClipConfig(ModelSelect + "#" + numImages);
                } else {
                  if (e.key === 'Enter') {

                    handleKeyPressCLIP(e, cleanedText, numImages, ModelSelect, QueryLanguage, setSearchResult, setSearchMode);

                    setClipConfig(ModelSelect + "#" + numImages);
                  }
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
