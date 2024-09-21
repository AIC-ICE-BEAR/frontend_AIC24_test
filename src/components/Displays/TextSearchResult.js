import React from 'react';
import { BiSolidLike, BiSolidDislike } from 'react-icons/bi';
import { FaLink } from 'react-icons/fa';

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
    setImageSimformVisible
}) {
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
                            onClick={() => handleImageClick(item.video_name, item.keyframe_id)}
                            onDoubleClick={() => handleDoubleClick(item.video_name, item.keyframe_id)}
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
                        </div>

                        {/* Display the image name */}
                        {item.video_name} {item.keyframe_id}.jpg
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TextSearchResult;
