// TextSession.js
import React from 'react';

const TextSession = ({ items }) => {
    return (
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
            {items.map((item, index) => {
                if (item.type === 'text') {
                    return (
                        <div key={`text-${index}`} className="flex justify-end">
                            <div className="bg-blue-100 text-blue-800 p-2 rounded-lg max-w-xs w-auto break-words shadow-md">
                                {item.content}
                            </div>
                        </div>
                    );
                } else if (item.type === 'image') {
                    return (
                        <div key={`img-${index}`} className="flex justify-start">
                            <img
                                src={`${process.env.REACT_APP_IMAGE_PATH}/${item.content.video_name}/${item.content.keyframe}.jpg`}
                                alt={`VQA result ${index}`}
                                className="w-1/2 rounded-lg max-w-xs shadow-md"
                            />
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
};

export default TextSession;
