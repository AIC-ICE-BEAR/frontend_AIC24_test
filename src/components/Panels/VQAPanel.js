import React, { useState, useEffect } from 'react';
import { useVQASearchResult } from '../../contexts/VQAContext';
import { useModeContext } from '../../contexts/searchModeContext';
import { useVQASearchImage } from '../../contexts/VQAImageContext';
import { handleKeyPressCLIP } from '../utils/ServicesUtils';
import TextSession from '../VisualQA/TextSession'; // Import TextSession component

const VQAPanel = ({ numImages, setNumImages }) => {
    const { VQAResult, setVQAResult } = useVQASearchResult();
    const { setSearchMode } = useModeContext();
    const [ModelSelect, setModelSelect] = useState('ViT-bigG-2B');
    const [VQAquery, setVQAquery] = useState('');
    const { VQAImage, setVQAImage } = useVQASearchImage(); // Use VQAImage to display images
    const [queries, setQueries] = useState([]); // State to store queries
    const [QueryLanguage, setQueryLanguage] = useState('Eng');
    const [sessionItems, setSessionItems] = useState([]); // State to hold items for TextSession
    const [imageCount, setImageCount] = useState(0); // Track the number of images added

    // Add text entry to session items
    const addText = (text) => {
        if (text.trim()) {
            setSessionItems((prevItems) => [...prevItems, { type: 'text', content: text }]);
        }
    };

    // Add image entry to session items
    const addImage = (imageSrc) => {
        setSessionItems((prevItems) => [...prevItems, { type: 'image', content: imageSrc }]);
    };

    // Handle key press to add text and process query
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && VQAquery.trim()) {
            e.preventDefault();
            setQueries([...queries, VQAquery]);
            addText(VQAquery);
            handleKeyPressCLIP(e, VQAquery, numImages, ModelSelect, QueryLanguage, setVQAResult, setSearchMode);
            setVQAquery('');
        }
    };


    const handleRefresh = () => {
        setQueries([]);
        setVQAImage([]);
        setSessionItems([]);
        setImageCount(0);

    };

    // Add images from VQAImage to session when available
    useEffect(() => {
        if (VQAImage && VQAImage.length > imageCount) {
            const newImages = VQAImage.slice(imageCount);
            newImages.forEach((image) => addImage(image));
            setImageCount(VQAImage.length);
        }
    }, [VQAImage, imageCount]);

    return (
        <div className="flex flex-col h-full p-4 border-black bg-gray-300 space-y-4 rounded-xl">
            {/* Header */}
            <p>VQA</p>

            {/* Model Selection */}
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

            {/* Refresh Button */}
            <div>
                <img
                    className="w-8 p-0.5 rounded-md hover:bg-black cursor-pointer"
                    src={'./refresh.png'}
                    alt="Refresh"
                    onClick={handleRefresh} // Call handleRefresh when clicked
                />
            </div>

            {/* Text Session Component */}
            <TextSession items={sessionItems} />

            {/* Text Box */}
            <div className="flex-none">
                <textarea
                    className="shadow appearance-none border-2 rounded-full w-full py-2 px-4 focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="Fill query and press enter"
                    value={VQAquery}
                    onChange={(e) => setVQAquery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows="1"
                    style={{ height: 'auto' }}
                />
            </div>
        </div>
    );
};

export default VQAPanel;
