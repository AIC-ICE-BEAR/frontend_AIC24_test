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
  const [TranslateResult, setTranslateResult] = useState([])
  const [textquerylist, settextquerylist] = useState(['']); // Initialize with primary Textquery
  const [QueryLanguage, setQueryLanguage] = useState('Eng');
  const [isLanguageSwitchChecked, setIsLanguageSwitchChecked] = useState(false);
  const { FBImage, setFBImage } = useFeedbackImage();



  const handleLanguageSwitch = (checked) => {
    setIsLanguageSwitchChecked(checked);
    setQueryLanguage(checked ? "Vie" : "Eng");
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
    <div className="p-4 border-b w-80 ">
      <div className="query-controls mb-5">
        <p>TEXT</p>
        <div className="query-controls mb-5">

          <div className="flex justify-center gap-8">

            <select
              id="modelSelect"
              value={ModelSelect}
              onChange={(e) => setModelSelect(e.target.value)}
              className="border border-gray-300 rounded p-4 text-sm"
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

        {/* <div className="flex items-center justify-center my-4 gap-2">
          <label>Eng</label>
          <Switch onChange={handleLanguageSwitch} checked={isLanguageSwitchChecked} />
          <label>Vie</label>
        </div> */}
        {TranslateResult.map((translatedQuery, index) => (
          <div>
            query {index}
            <textarea
              className="shadow appearance-none border-2 rounded w-full py-2 px-3 flex-grow"
              value={translatedQuery}

              rows="1"
              style={{ height: 'auto' }}
            />
          </div>
        ))}

        <p className="p-5">Enter here</p>

        {textquerylist.map((query, index) => (
          <div key={index} className="flex items-start gap-2 mb-2">
            <textarea
              className="shadow appearance-none border-2 rounded w-full py-2 px-3 flex-grow"
              placeholder={`${index === 0 ? "Describe then scene" : "Describe what happens next"} `}
              value={query}
              onChange={(e) => handleChangeMultiQuery(index, e.target.value)}
              onKeyPress={async (e) => {
                // Clean text before handling key press
                const cleanedText = query.trim().replace(/\s+/g, ' ');

                if (textquerylist.length > 1) {
                  if (QueryLanguage == "Vie") {
                    if (e.key === 'Enter') {
                      const Translated = await handleKeyPressTranslate(e, textquerylist, setTranslateResult);

                      console.log(Translated)
                      handleKeyPressFused(e, Translated.map(q => q.trim().replace(/\s+/g, ' ')), numImages, ModelSelect, setSearchResult, setSearchMode);
                    }
                  }
                  else {

                    handleKeyPressFused(e, textquerylist.map(q => q.trim().replace(/\s+/g, ' ')), numImages, ModelSelect, setSearchResult, setSearchMode);
                  }



                  setClipConfig(ModelSelect + "#" + numImages);
                } else {
                  handleKeyPressCLIP(e, cleanedText, numImages, ModelSelect, QueryLanguage, setSearchResult, setSearchMode);
                  if (QueryLanguage == "Vie") {
                    handleKeyPressTranslate(e, [cleanedText], setTranslateResult)
                  }
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
