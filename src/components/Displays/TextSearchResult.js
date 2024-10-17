import React, { useState } from 'react';
import { BiSolidLike, BiSolidDislike } from 'react-icons/bi';
import { FaLink } from 'react-icons/fa';
import { MdSend } from "react-icons/md";

function TextSearchResult({
    displayResult,
    selectedImage,
    handleLikeClick,
    handleDisLikeClick,
    handleImageClick,
    handleDoubleClick,
    handleClickImgSim,
    handleVQAClick,
    handlePlayVideoClick,
    handleOpenImageInNewTab,
    ClipConfig,
    setImageSimiResult,
    setImageSimformVisible,
    getkeyframe,
    submitSelectedImageClick
}) {
    // State to hold frame indices for each image
    const [frameIndices, setFrameIndices] = useState({});

    // Function to fetch keyframes for a specific image
    const fetchKeyframe = async (videoName, keyframeId) => {
        if (!frameIndices[`${videoName}-${keyframeId}`]) { // Only fetch if not already fetched
            try {
                const index = await getkeyframe(videoName, keyframeId);
                setFrameIndices(prevIndices => ({
                    ...prevIndices,
                    [`${videoName}-${keyframeId}`]: index, // Update the frame index for the specific image
                }));
            } catch (error) {
                console.error("Error fetching keyframe:", error);
            }
        }
    };

    return (
        <div className="overflow-y-auto h-screen">
            <div className="justify-between grid grid-cols-5 gap-2">
                {displayResult.map((item, index) => (
                    <div
                        key={index}
                        className={`relative border p-1 bg-white ${selectedImage === `${item.video_name}-${item.keyframe_id}` ? 'border-4 border-red-500' : 'border-gray-300'}`}
                    >
                        {/* Like and Dislike buttons */}
                        <div className="flex justify-between mb-2">
                            <button className="text-green-500 hover:text-green-700" onClick={() => handleLikeClick(item.video_name, item.keyframe_id)}>
                                <BiSolidLike className="w-6 h-6" />
                            </button>
                            <button className="text-red-500 hover:text-red-700" onClick={() => handleDisLikeClick(item.video_name, item.keyframe_id)}>
                                <BiSolidDislike className="w-6 h-6" />
                            </button>
                        </div>

                        <img
                            src={`${process.env.REACT_APP_IMAGE_PATH}/${item.video_name}/${item.keyframe_id}.jpg`}
                            className="w-full h-auto"
                            alt={item.keyframe_id}
                            onClick={() => {
                                handleImageClick(item.video_name, item.keyframe_id);
                                fetchKeyframe(item.video_name, item.keyframe_id); // Fetch keyframe on image click
                            }}
                            onDoubleClick={() => handleDoubleClick(item.video_name, item.keyframe_id)}
                        />

                        <div className="flex mt-2 justify-between items-center">
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
                                onClick={() => handleVQAClick(item.video_name, item.keyframe_id)}
                                alt="vqa"
                            />

                            <FaLink className="w-6 h-8 p-0.5 rounded-md border-2 hover:border-black cursor-pointer"
                                onClick={() => handleOpenImageInNewTab(item.video_name, item.keyframe_id)}
                                alt="direct-link" />

                            <MdSend className="w-6 h-8 p-0.5 rounded-md border-2 hover:border-black cursor-pointer"
                                onClick={() => submitSelectedImageClick(item.video_name, item.keyframe_id)}
                                alt="sendsubmit" />


                        </div>

                        {/* Display the image name and frame index */}
                        <div>
                            {item.video_name} {item.keyframe_id}.jpg
                            {frameIndices[`${item.video_name}-${item.keyframe_id}`] !== undefined && (
                                <span>  {frameIndices[`${item.video_name}-${item.keyframe_id}`]}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TextSearchResult;
