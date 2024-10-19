import React, { useState } from 'react';
import Switch from "react-switch";
import { handleKeyPressASR, handleKeyPressOCR } from "../utils/ServicesUtils";

import { useASRSearchResult } from '../../contexts/ASRsearchContext';
import { useModeContext } from '../../contexts/searchModeContext';

const ASRPanel = ({ numImages, setNumImages }) => {

    const { setASRResult } = useASRSearchResult();
    const { setSearchMode } = useModeContext();

    const [ASRquery, setASRquery] = useState('');

    const [ASRMode, setASRMode] = useState('elastic');
    const [isASRModeSwitchChecked, setisASRModeSwitchChecked] = useState(false);

    const handlemodeSwitch = (checked) => {
        setisASRModeSwitchChecked(checked);
        setASRMode(checked ? "fast" : "elastic");
    };

    return (
        <div className="p-4 border-b">


            <div className="w-64 mb-5">
                <p>ASR</p>
                <div className="flex items-center justify-center my-4 gap-2">
                    <label>Elastic</label>
                    <Switch onChange={handlemodeSwitch} checked={isASRModeSwitchChecked} />
                    <label>Slow</label>
                </div>

                {/* <div className="flex items-center justify-center my-4 gap-2">
                    <label>Translate</label>
                    <Switch />
                </div> */}


                <textarea
                    className="shadow appearance-none border-2 rounded w-full py-2 px-3"
                    placeholder="Fill query and press enter"
                    value={ASRquery}
                    onChange={(e) => setASRquery(e.target.value)}

                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                        }

                        handleKeyPressASR(e, ASRquery, ASRMode, numImages, setASRResult, setSearchMode)
                    }}
                    rows="1"
                    style={{ height: 'auto' }}
                />
            </div>


        </div>
    );
};

export default ASRPanel;
