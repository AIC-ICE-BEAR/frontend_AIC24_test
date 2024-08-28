import React, { useState ,  useEffect} from 'react';
import Switch from "react-switch";
import { handleKeyPressCLIP } from "./ServicesUtils";
import { useSearchResult } from '../contexts/ClipsearchContext';
import { useModeContext } from '../contexts/searchModeContext';
import { useClipConfig } from '../contexts/ClipSearchConfigContext'
const SEMPanel = ({ numImages, setNumImages }) => {
  const { setSearchResult } = useSearchResult();
  const { setSearchMode } = useModeContext();
  const {ClipConfig, setClipConfig} = useClipConfig(); 

  const [ModelSelect, setModelSelect] = useState('ViT-bigG-14');
  const [Textquery, setTextquery] = useState('');
  const [textquerylist, settextquerylist] = useState([]);
  const [QueryLanguage, setQueryLanguage] = useState('Eng');
  const [isLanguageSwitchChecked, setIsLanguageSwitchChecked] = useState(false);

  const handleLanguageSwitch = (checked) => {
    setIsLanguageSwitchChecked(checked);
    setQueryLanguage(checked ? "Vie" : "Eng");
  };

  const handleChange = (e) => {
    setTextquery(e.target.value);
    autoResize(e);
  };

  const handleChangeMultiQuery = (index, value) => {
    const newTextQueryList = [...textquerylist];
    newTextQueryList[index] = value;
    settextquerylist(newTextQueryList);
  };

  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  useEffect( ()=> 
    {
        setClipConfig(ModelSelect + "#" + numImages)
        console.log("Clip config", ClipConfig)
    }, [ModelSelect, numImages ])


  const handleMuliQueryPress = (e, query) => {
            handleKeyPressCLIP(e, query, numImages, ModelSelect, QueryLanguage, setSearchResult, setSearchMode);
        };
        
  const addQueryBox = () => {
        settextquerylist([...textquerylist, '']);
        };
  const handleRemove = (index) => {
        const newTextQueryList = textquerylist.filter((_, i) => i !== index);
        settextquerylist(newTextQueryList);
      };

    return (
        <div className="p-4 border-b">
          <div className="query-controls mb-5">
            <p>TEXT</p>
            <div className="flex justify-center  gap-8">
              <div>
                <label>ViT-bigG-14</label>
                <input
                  type="radio"
                  value="ViT-bigG-14"
                  checked={ModelSelect === 'ViT-bigG-14'}
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
                <label>Blip2-ViTG</label>
                <input
                  type="radio"
                  value="Blip2-ViTG"
                  checked={ModelSelect === 'Blip2-ViTG'}
                  onChange={(e) => setModelSelect(e.target.value)}
                />
              </div>
            </div>
    
            <div className="flex items-center justify-center my-4 gap-2">
              <label>Eng</label>
              <Switch onChange={handleLanguageSwitch} checked={isLanguageSwitchChecked} />
              <label>Vie</label>
            </div>
    
            <div className="flex items-center justify-center my-4 gap-2">
              <label>K</label>
              <input type="range" min="1" max="200" value={numImages} onChange={(e) => setNumImages(e.target.value)} />
              <label>{numImages}</label>
            </div>


            <div className=" text-mode-options">
                <textarea
                    class="shadow appearance-none border-2 rounded border-black w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Describe the scene "
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
    
            {textquerylist.map((query, index) => (
                <div key={index} className="flex items-start gap-2 mb-2">
                    <textarea
                    className="shadow appearance-none border-2 rounded w-full py-2 px-3 flex-grow"
                    placeholder="describe what happen next"
                    value={query}
                    onChange={(e) => handleChangeMultiQuery(index, e.target.value)}
                    onKeyPress={(e) => {
                        console.log("Submitted ", [Textquery, ...textquerylist])
                        setClipConfig(ModelSelect + "#" + numImages)
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