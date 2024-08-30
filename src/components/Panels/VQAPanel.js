import React, { useState } from 'react';
import { handleKeyPressOCR } from "../utils/ServicesUtils";
import { useOCRSearchResult } from '../../contexts/OCRsearchContext';

import { useModeContext } from '../../contexts/searchModeContext';

const VQAPanel = ({ numImages, setNumImages }) => {
    const { setOCRResult } = useOCRSearchResult();

    const { setSearchMode } = useModeContext();


    const [OCRquery, setOCRquery] = useState('');


    return (
        <div className="p-4 border-b ">


            <div className="mb-5">
                <p>OCR</p>
                <textarea
                    className="shadow appearance-none border-2 rounded w-full py-2 px-3"
                    placeholder="Fill query and press enter"
                    value={OCRquery}
                    onChange={(e) => setOCRquery(e.target.value)}
                    onKeyPress={(e) => handleKeyPressOCR(e, OCRquery, numImages, setOCRResult, setSearchMode)}
                    rows="1"
                    style={{ height: 'auto' }}
                />
            </div>
        </div>
    );
};

export default VQAPanel;
