import React, { useEffect, useState } from 'react';
import { FaLink } from 'react-icons/fa';
import { MdSend } from "react-icons/md";
function ASRSearchResult({
    displayResult,
    selectedImage,
    handleImageClick,
    handleDoubleClick,
    handleClickImgSim,
    handlePlayVideoClick,
    handleVQAClick,
    handleOpenImageInNewTab,
    ClipConfig,
    setImageSimiResult,
    setImageSimformVisible,
    getkeyframe,
    submitSelectedImageClick
}) {

    const [frameIndices, setFrameIndices] = useState({});

    // Effect to fetch keyframes for each image when the component mounts
    useEffect(() => {
        const fetchAllKeyframes = async () => {
            const indices = {};

            for (const item of displayResult) {
                for (const key_id of item.keyframe_id) {
                    try {
                        const index = await getkeyframe(item.video_name, key_id);
                        indices[`${item.video_name}-${key_id}`] = index; // Store index using a unique key
                    } catch (error) {
                        console.error("Error fetching keyframe:", error);
                    }
                }
            }
            setFrameIndices(indices); // Update state with all frame indices
        };

        fetchAllKeyframes(); // Call the fetch function
    }, [displayResult, getkeyframe]);
    return (
        <div className="overflow-y-auto h-screen">
            {displayResult.map((item, index) => (
                <div key={index} className="border border-gray-300 p-1 bg-white my-2">
                    <div className="grid grid-cols-5 gap-2">
                        {item.keyframe_id.map((key_id, idx) => (
                            <div key={idx} className={`w-full h-auto ${selectedImage === `${item.video_name}-${key_id}` ? 'border-4 border-red-500' : 'border-gray-300'}`}>
                                <img
                                    src={`${process.env.REACT_APP_IMAGE_PATH}/${item.video_name}/${key_id}.jpg`}
                                    alt={key_id}
                                    onClick={() => handleImageClick(item.video_name, key_id)}
                                    onDoubleClick={() => handleDoubleClick(item.video_name, key_id)}
                                />


                                <div className="flex mt-2 justify-between items-center">
                                    <img className="w-8 p-0.5 rounded-md hover:bg-black" src={'./imgSim.png'}
                                        onClick={() => handleClickImgSim(item.video_name, key_id, ClipConfig, setImageSimiResult, setImageSimformVisible)}
                                        alt="img-sim" />

                                    <img className="w-8 p-0.5 rounded-md hover:bg-black" src={'./play_button.jpg'}
                                        onClick={() => handlePlayVideoClick(item.video_name, key_id)}
                                        alt="vid-watch" />

                                    <img className="w-8 p-0.5 rounded-md hover:bg-black" src={'./image_icon.jpg'}
                                        onClick={() => handleDoubleClick(item.video_name, key_id)}
                                        alt="img-watch" />

                                    <img className="w-8 p-0.5 rounded-md hover:bg-black"
                                        src={'./VQA.jpg'}
                                        onClick={() => {
                                            handleVQAClick(item.video_name, key_id);
                                        }}
                                        alt="vqa"
                                    />

                                    <FaLink className="w-6 h-8 p-0.5 rounded-md border-2 hover:border-black cursor-pointer"
                                        onClick={() => handleOpenImageInNewTab(item.video_name, key_id)}
                                        alt="direct-link" />

                                    <MdSend className="w-6 h-8 p-0.5 rounded-md border-2 hover:border-black cursor-pointer"
                                        onClick={() => submitSelectedImageClick(item.video_name, key_id)}
                                        alt="sendsubmit" />
                                </div>

                                {/* Display the image name */}

                                {item.video_name} {key_id}.jpg
                                {frameIndices[`${item.video_name}-${key_id}`] !== undefined && (
                                    <span>  {frameIndices[`${item.video_name}-${key_id}`]}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="border-t mt-2 p-3 text-2xl border-2 border-black justify-items-center align-middle">
                        <p>{item.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ASRSearchResult;
