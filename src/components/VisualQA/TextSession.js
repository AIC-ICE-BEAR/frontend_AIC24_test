// TextSession.js
import React, { useEffect, useState } from 'react';

const TextSession = ({ items }) => {
    const [sessionItems, setSessionItems] = useState([]);

    // Initialize with bot messages only once
    useEffect(() => {
        const initialMessages = [
            { type: 'text', content: 'Hi there!', sender: 'bot' },
            { type: 'text', content: 'Enter your query in the text box then press enter to look for year event.', sender: 'bot' },
            { type: 'text', content: 'Next, select the images that you want to ask about by pressing the QA icon button under the image.', sender: 'bot' },
            { type: 'text', content: 'Then, ask your question about your image then press enter again to get the answer.', sender: 'bot' },
        ];
        setSessionItems(initialMessages);
    }, []);




    useEffect(() => {
        if (items.length === 0) {

            const initialMessages = [
                { type: 'text', content: 'The scene begins in a supermarket in the Binh bag area. It ends with a scene of "Neptune" brand Japonica bags, with a price tag.', sender: 'user' },
                {
                    type: 'image', content: {
                        video_name: "L04/L04_V029",
                        keyframe: 183
                    }
                    , sender: 'bot'
                },
                { type: 'text', content: 'What percentage discount is written for this product?', sender: 'user' },
                { type: 'text', content: 'The discount percentage is 19%', sender: 'bot' },
            ];
            setSessionItems(initialMessages); // Reset to initial bot messages
        } else {
            // Remove initial bot messages and add new items
            setSessionItems((prevItems) => {

                const hasInitialMessages = prevItems.some(item => item.sender === 'bot' && item.content.startsWith('Hi there!'));

                if (hasInitialMessages) {
                    return items;
                }

                const uniqueNewItems = items.filter(
                    (item) =>
                        !prevItems.some(
                            (sessionItem) => JSON.stringify(sessionItem) === JSON.stringify(item)
                        )
                );
                return [...prevItems, ...uniqueNewItems];
            });
        }
    }, [items]);


    return (
        <div className="flex flex-col space-y-2 p-4 bg-gray-300 rounded-lg h-full overflow-y-auto">
            {sessionItems.map((item, index) => (
                <div
                    key={index}
                    className={`flex ${item.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                    {item.type === 'text' ? (
                        <p className={`p-3 rounded-lg max-w-xs ${item.sender === 'bot' ? 'bg-gray-100 text-left' : 'bg-blue-100 text-left'}`}>
                            {item.content}
                        </p>
                    ) : (
                        <img
                            src={`${process.env.REACT_APP_IMAGE_PATH}/${item.content.video_name}/${item.content.keyframe}.jpg`}
                            alt="VQA" className="rounded-lg w-48" />
                    )}
                </div>
            ))}
        </div>
    );
};

export default TextSession;




