import React, { useEffect, useState } from 'react';
import { FaLink } from 'react-icons/fa';
import { MdSend } from "react-icons/md";
function TemporalSearchResult({
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
                try {
                    const index = await getkeyframe(item.video_name, item.keyframe_id);
                    indices[`${item.video_name}-${item.keyframe_id}`] = index; // Store index using a unique key
                } catch (error) {
                    console.error("Error fetching keyframe:", error);
                }
            }
            setFrameIndices(indices); // Update state with all frame indices
        };

        fetchAllKeyframes(); // Call the fetch function
    }, [displayResult, getkeyframe]);
    return (
        <div className="overflow-y-auto h-screen">
            <div className="grid grid-cols-1 gap-2">
                {displayResult.map((item, index) => (
                    <div key={index} className="border p-2 bg-white border-black">
                        <div className="grid grid-cols-4 flex-row gap-2">
                            {item.matched_frames.map((frameId, index) => (
                                <div key={index} className={`border p-1 bg-white ${selectedImage === `${item.video_name}-${frameId}` ? 'border-4 border-red-500' : 'border-gray-300'}`}>
                                    <img
                                        src={`${process.env.REACT_APP_IMAGE_PATH}/${item.video_name}/${frameId}.jpg`}
                                        className="w-full h-auto"
                                        alt={frameId}
                                        onClick={() => handleImageClick(item.video_name, frameId)}
                                        onDoubleClick={() => handleDoubleClick(item.video_name, frameId)}
                                    />

                                    <div className="flex mt-2 justify-between">
                                        <img className="w-8 p-0.5 rounded-md hover:bg-black" src={'./imgSim.png'}
                                            onClick={() => handleClickImgSim(item.video_name, item.keyframe_id, ClipConfig, setImageSimiResult, setImageSimformVisible)}
                                            alt="img-sim" />

                                        <img className="w-8 p-0.5 rounded-md hover:bg-black" src={'./play_button.jpg'}
                                            onClick={() => handlePlayVideoClick(item.video_name, item.keyframe_id)}
                                            alt="vid-watch" />

                                        <img className="w-8 p-0.5 rounded-md hover:bg-black" src={'./image_icon.jpg'}
                                            onClick={() => handleDoubleClick(item.video_name, item.keyframe_id)}
                                            alt="img-watch" />

                                        <img className="w-8 p-0.5 rounded-md hover:bg-black"
                                            src={'./VQA.jpg'}
                                            onClick={() => {
                                                handleVQAClick(item.video_name, item.keyframe_id);
                                            }}
                                            alt="vqa"
                                        />

                                        <FaLink className="w-6 h-8 p-0.5 rounded-md border-2 hover:border-black cursor-pointer"
                                            onClick={() => handleOpenImageInNewTab(item.video_name, item.keyframe_id)}
                                            alt="direct-link" />
                                        <MdSend onClick={() => submitSelectedImageClick(item.video_name, item.keyframe_id)}
                                            alt="sendsubmit" />
                                    </div>

                                    {/* Display the image name */}


                                    {item.video_name} {frameId}.jpg
                                    {frameIndices[`${item.video_name}-${frameId}`] !== undefined && (
                                        <span>  {frameIndices[`${item.video_name}-${frameId}`]}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 text-center">
                            <span>{item.video_name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TemporalSearchResult;
