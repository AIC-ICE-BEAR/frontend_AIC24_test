import React, { useState, useEffect } from 'react';
import Switch from "react-switch";
import { handleKeyPressTemporal } from "../utils/ServicesUtils";
import { handleKeyPressTranslate } from '../utils/ServicesUtils'
/home/tiendat / frontend_AIC24_test / scriptsimport { useSearchResult } from '../../contexts/ClipsearchContext';
import { useModeContext } from '../../contexts/searchModeContext';
import { useClipConfig } from '../../contexts/ClipSearchConfigContext';
import { useTemporalSearchResult } from '../../contexts/TemporalSearchContext'

const TemporalPanel = ({ numImages, setNumImages }) => {
    const { setSearchResult } = useSearchResult();
    const { setSearchMode } = useModeContext();
    const { ClipConfig, setClipConfig } = useClipConfig();
    const { TemporalResult, setTemporalResult } = useTemporalSearchResult();

    const [ModelSelect, setModelSelect] = useState('ViT-bigG-2B');
    const [Textquery, setTextquery] = useState('');

    const [textquerylist, settextquerylist] = useState(['']); // Initialize with primary Textquery
    const [isModeSwitchChecked, setisModeSwitchChecked] = useState(false);
    const [TemporalMetric, setTemporalMetric] = useState("exp_dot");

    const [QueryLanguage, setQueryLanguage] = useState('en');
    // const [TranslateResult, setTranslateResult] = useState([])
    const [SplitMode, setSplitMode] = useState(false);
    const [isSplitSwitchChecked, setisSplitSwitchChecked] = useState(false);
    const [isLanguageSwitchChecked, setIsLanguageSwitchChecked] = useState(false);



    // Image distance
    const [ImageDistance, setImageDistance] = useState(-1);



    const handleLanguageSwitch = (checked) => {
        setIsLanguageSwitchChecked(checked);
        setQueryLanguage(checked ? "vi" : "en");
    };


    const handleSplitSwitch = (checked) => {
        setisSplitSwitchChecked(checked);
        setSplitMode(checked ? true : false);
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


    // const handleRemoveTranslate = (index) => {

    //     const newTranslateResult = TranslateResult.filter((_, i) => i !== index);
    //     setTranslateResult(newTranslateResult);
    // };

    return (
        <div className="p-4 border-b max-h-full overflow-y-auto">
            <div className="query-controls mb-5">
                <p className="pb-4">TEMPORAL</p>
                <div className="query-controls mb-5">

                    <div className="flex flex-col pt-5 justify-center gap-4">
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


                    <div className="flex flex-col justify-center gap-4">
                        <p>Select metric</p>
                        <select
                            id="metrci select"
                            value={TemporalMetric}
                            onChange={(e) => setTemporalMetric(e.target.value)}
                            className="border border-black rounded p-4 text-sm"
                        >
                            <option value="dot">dot</option>
                            <option value="exp_dot">exp_dot</option>
                            <option value="taylor_exp_dot">taylor_exp_dot</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label> Maximum distance</label>
                    <input
                        className="shadow appearance-none border-2 rounded py-2 px-2"
                        placeholder={`Maximum distance`}
                        value={ImageDistance}
                        onChange={(e) => setImageDistance(e.target.value)}
                    />

                </div>

                <div className="flex items-center justify-center my-4 gap-2">
                    <label>Translate</label>
                    <Switch onChange={handleLanguageSwitch} checked={isLanguageSwitchChecked} />
                </div>


                <div className="flex items-center justify-center my-4 gap-2">
                    <label>Split query</label>
                    <Switch onChange={handleSplitSwitch} checked={isSplitSwitchChecked} />
                </div>

                Enter here
                {textquerylist.map((query, index) => (
                    <div key={index} className="flex items-start gap-2 mb-2">
                        <textarea
                            className="shadow appearance-none border-2 rounded w-full py-2 px-3 flex-grow"
                            placeholder={`${index === 0 ? "Describe then scene" : "Describe what happens next"} `}
                            value={query}
                            onChange={(e) => handleChangeMultiQuery(index, e.target.value)}
                            onKeyPress={async (e) => {
                                // Clean text before handling key press
                                if (QueryLanguage == "vi") {
                                    if (e.key === 'Enter') {
                                        const Translated = await handleKeyPressTranslate(e, textquerylist);
                                        handleKeyPressTemporal(e, Translated.map(q => q.trim().replace(/\s+/g, ' ')), numImages, TemporalMetric, ModelSelect, setTemporalResult, SplitMode, ImageDistance);
                                    }
                                }
                                else {

                                    handleKeyPressTemporal(e, textquerylist.map(q => q.trim().replace(/\s+/g, ' ')), numImages, TemporalMetric, ModelSelect, setTemporalResult, SplitMode, ImageDistance);
                                }
                                setClipConfig(ModelSelect + "#" + numImages);

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

export default TemporalPanel;
