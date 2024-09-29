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
            setSessionItems((prevItems) => [...prevItems, { type: 'text', content: text, sender: 'user' }]);
        }
    };

    // Add image entry to session items
    const addImage = (imageSrc) => {
        setSessionItems((prevItems) => [...prevItems, { type: 'image', content: imageSrc, sender: 'bot' }]);
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

    useEffect(() => {
        if (VQAImage && VQAImage.length > imageCount) {
            const newImages = VQAImage.slice(imageCount); // Get only new images
            newImages.forEach((image) => addImage(image)); // Use addImage from TextSession
            setImageCount(VQAImage.length); // Update the count of images processed
        }
    }, [VQAImage, imageCount]);

    return (
        <div className="flex flex-col h-full p-4 border-black bg-gray-300 space-y-4 rounded-xl">
            {/* Header */}
            <p>VQA</p>

            {/* Model Selection */}
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

            {/* Refresh Button */}
            <div>
                <img
                    className="w-8 p-0.5 rounded-md border-gray-300 border-4 hover:border-black cursor-pointer"
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
