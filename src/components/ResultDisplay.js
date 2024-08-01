import React, { useState, useEffect, useRef } from 'react';
import { useSearchResult } from '../contexts/ClipsearchContext';
import { useModeContext } from '../contexts/searchModeContext';
import axios from 'axios';

function DisplayResult({ style }) {
  const { searchResult } = useSearchResult();
  const { searchMode, setSearchMode } = useModeContext();
  const scrollContainerRef = useRef(null);
  // setSearchMode("asr")
  const [result, setResult] = useState([
    {
      "video_name": "L01_V002", 
      "img_1": 40, 
      "img_2": 50, 
      "img_3": 60, 
      "img_4": 70, 
      "img_5": 80, 
      "text": "tia X gọi là chủ cắt lớp tương phản pha phân cấp Hip City"
    },
    {
      "video_name": "L02_V002",
      "img_1": 1, 
      "img_2": 2, 
      "img_3": 3, 
      "img_4": 4, 
      "img_5": 5, 
      "text": "Thực sự đây là kỹ thuật mà chúng tôi đã chờ đợi trong nhiều năm"
    }
  ]);

  useEffect(() => {
    // Reset scroll position to the top whenever searchResult changes
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [searchResult]);

  const extract_name_img = (vid_name, kf_id) => {
    const videoNumber = parseInt(vid_name.slice(1, 3));
    let formattedNumber;
    if (videoNumber >= 17) {
      formattedNumber = kf_id.toString().padStart(3, '0');
    } else {
      formattedNumber = kf_id.toString().padStart(4, '0');
    }
    return `${formattedNumber}.jpg`;
  };

  return (
    <div className="block w-screen" style={style}>
      <div>
        <label>Result</label>
        {/* For CLIP search and OCR*/}
        {searchResult && searchMode === 'text' && (
          <div className="overflow-y-auto h-screen" ref={scrollContainerRef}>
            <div className="grid grid-cols-5 gap-2">
              {searchResult.map((item, index) => (
                <div key={index} className="border border-gray-300 p-1 bg-white">
                  <img
                    src={`${process.env.REACT_APP_IMAGE_PATH}/Keyframes_${item.video_name.slice(0, 3)}/${item.video_name}/${extract_name_img(item.video_name, item.keyframe_id)}`}
                    className="w-full h-auto"
                    alt={item.keyframe_id}
                  />
                  {item.video_name} {extract_name_img(item.video_name, item.keyframe_id)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* For ASR search*/}


        {result && searchMode === 'asr' && (
          <div className="overflow-y-auto h-screen" ref={scrollContainerRef}>
            {result.map((item, index) => (
              <div key={index} className="border border-gray-300 p-1 bg-white my-2">
                <div className="grid grid-cols-5 gap-2">
                  <img
                    src={`${process.env.REACT_APP_IMAGE_PATH}/Keyframes_${item.video_name.slice(0, 3)}/${item.video_name}/${extract_name_img(item.video_name, item.img_1)}`}
                    className="w-full h-auto"
                    alt={`${item.img_start}`}
                  />
                  <img
                    src={`${process.env.REACT_APP_IMAGE_PATH}/Keyframes_${item.video_name.slice(0, 3)}/${item.video_name}/${extract_name_img(item.video_name, item.img_2)}`}
                    className="w-full h-auto"
                    alt={`${item.img_avg}`}
                  />
                  <img
                    src={`${process.env.REACT_APP_IMAGE_PATH}/Keyframes_${item.video_name.slice(0, 3)}/${item.video_name}/${extract_name_img(item.video_name, item.img_3)}`}
                    className="w-full h-auto"
                    alt={`${item.img_end}`}
                  />
                  <img
                    src={`${process.env.REACT_APP_IMAGE_PATH}/Keyframes_${item.video_name.slice(0, 3)}/${item.video_name}/${extract_name_img(item.video_name, item.img_4)}`}
                    className="w-full h-auto"
                    alt={`${item.img_end}`}
                  />
                  <img
                    src={`${process.env.REACT_APP_IMAGE_PATH}/Keyframes_${item.video_name.slice(0, 3)}/${item.video_name}/${extract_name_img(item.video_name, item.img_5)}`}
                    className="w-full h-auto"
                    alt={`${item.img_end}`}
                  />
                </div>
                <div className="border-t mt-2 p-3 text-2xl border-2 border-black justify-items-center align-middle">
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


export default DisplayResult;
