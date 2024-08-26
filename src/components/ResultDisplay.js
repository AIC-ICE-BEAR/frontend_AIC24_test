import React, { useState, useEffect, useRef } from 'react';
import { useSearchResult } from '../contexts/ClipsearchContext';
import { useOCRSearchResult } from '../contexts/OCRsearchContext'; 
import { useOBDetResult } from '../contexts/OBDetsearchContext'; 
import {useASRSearchResult} from '../contexts/ASRsearchContext'; 
import { useModeContext } from '../contexts/searchModeContext';
import {useClipConfig} from '../contexts/ClipSearchConfigContext';
import {useSubmitContext} from '../contexts/SubmitImageContext';
import {handleClickImgSim} from './ServicesUtils'
import {mapKeyframe, mapKeyframes} from './utils'


function DisplayResult({ style }) {
  // Load results from context
  const { searchResult } = useSearchResult();
  const { OBDetResult } = useOBDetResult(); 
  const { OCRResult } = useOCRSearchResult(); 
  const { ASRResult } = useASRSearchResult(); 
  // Display result 

  const [displayResult, setdisplayResult] = useState([]); 


  const { searchMode, setSearchMode } = useModeContext();
  const scrollContainerRef = useRef(null);
  // setSearchMode("asr")

  const [result, setResult] = useState([
    {
      "video_name": "L01_V002", 
      "key_frames":  [1,2,3,4,5], 
      "text": "tia X gọi là chủ cắt lớp tương phản pha phân cấp Hip City"
    },
    {
      "video_name": "L02_V002",
      "key_frames":  [1,2,3,4,5], 
      "text": "Thực sự đây là kỹ thuật mà chúng tôi đã chờ đợi trong nhiều năm"
    }
  ]);
  const [formVisible, setFormVisible] = useState(false);
  const [ImageSimformVisible, setImageSimformVisible] = useState(false);
  const [ImageSimiResult, setImageSimiResult] = useState([]);
  const [nextImages, setNextImages] = useState([]);
  const [selectedImage, setselectgedImage] = useState(); 
  const {ClipConfig} = useClipConfig(); 

  // For image submission

  const { setSubmission } = useSubmitContext(); 

  useEffect(() => {
    // Reset scroll position to the top whenever searchResult changes
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [displayResult]);





  useEffect(() => {
  
    setdisplayResult(searchResult);
    
  }, [searchResult]);

  useEffect(() => {
  
    setdisplayResult(OCRResult);
 
  }, [ OCRResult]);

  useEffect(() => {
  
    setdisplayResult(ASRResult);
 
  }, [ASRResult]);

  useEffect(() => {
  
    setdisplayResult(OBDetResult);
 
  }, [OBDetResult]);


  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setFormVisible(false);
        // setImageSimformVisible(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);


  useEffect(() => {
    const handleEnter = (event) => {
      if (event.key === 'Enter' && selectedImage) {
        submitSelectedImage();
      }
    };
    document.addEventListener('keydown', handleEnter);
    return () => {
      document.removeEventListener('keydown', handleEnter);
    };
  }, [selectedImage]);


  useEffect(() => {
    const handleOutsideClick = (event) => {
      // If the click is outside the images, deselect the image
      if (!event.target.closest('.image-container')) {
        setselectgedImage(null);
      }
    };
  
    // Add event listener for clicks
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);



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

  const handleDoubleClick = (vid_name, start_id) => {
    const nextImages = [];
    for (let i = -10 ; i <= 10; i++) {
      if (start_id + i <= 0) continue
      nextImages.push({
        video_name: vid_name,
        img_id: start_id + i
      });
    }
    setNextImages(nextImages);
    setFormVisible(true);
  };



  const submitSelectedImage = async () => {
      const splits = selectedImage.split('-')
      mapKeyframe(splits[0], splits[1])
        .then(result => {
          console.log("mapped keyframe" , result); 
          setSubmission(result)
        })
        .catch(error => {
          console.error(error);
        });
  };

  
  
  const handleImageClick = (vid_name, start_id) => {
    // this will handle image selection and submission
    setselectgedImage(`${vid_name}-${start_id}`);
  };



  const renderNextImagesForm = () => (
    <div className=" h-screen fixed top-20 left-0 w-full  bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <h2 className="text-2xl mb-4">Surrounded images</h2>
        <div className="overflow-y-auto h-screen grid grid-cols-5 gap-2">
          {nextImages.map((img, index) => (
            <div className={`border p-1 bg-white ${selectedImage === `${img.video_name}-${img.img_id}` ? 'border-4 border-red-500' : 'border-gray-300'}`}>
            <img
              key={index}
              src={`${process.env.REACT_APP_IMAGE_PATH}/Keyframes_${img.video_name.slice(0, 3)}/${img.video_name}/${extract_name_img(img.video_name, img.img_id)}`}
              className="w-full h-auto"
              alt={img.img_id}
              onClick={() =>handleImageClick(img.video_name, img.img_id)}
              onDoubleClick={() => handleDoubleClick(img.video_name, img.img_id)}
            />

         
            
             {img.video_name} {extract_name_img(img.video_name, img.img_id)}
            </div>
          ))}
          
        </div>
        <button className="mt-4 bg-red-500 text-white p-2 rounded" onClick={() => setFormVisible(false)}>Close</button>
      </div>
    </div>
  );


const renderImagesSimilarityForm = () => (
    <div className=" h-1/2 w-full bg-opacity-50 flex items-center justify-center z-50">
       <button className="mt-4 bg-red-500 text-white p-2 rounded" onClick={() => setImageSimformVisible(false)}>Close</button>
      <div className="overflow-y-auto max-h-[50vh] bg-white p-4 rounded w-full h-full">
        <div className="h-full grid grid-cols-5 gap-2">
          {ImageSimiResult.map((img, index) => (
            <div className={`border p-1 bg-white ${selectedImage === `${img.video_name}-${img.keyframe_id}` ? 'border-4 border-red-500' : 'border-gray-300'}`}>
              <img
                key={index}
                src={`${process.env.REACT_APP_IMAGE_PATH}/Keyframes_${img.video_name.slice(0, 3)}/${img.video_name}/${extract_name_img(img.video_name, img.keyframe_id)}`}
                className="w-full h-auto"
                alt={img.img_id}
                onClick={() => handleImageClick(img.video_name, img.keyframe_id)}
                onDoubleClick={() => handleDoubleClick(img.video_name, img.keyframe_id)}
              />
              <img className="w-8 p-0.5 rounded-md hover:bg-black"
                   src={'./imgSim.png'}
                   onClick={() => {
                    handleClickImgSim(img.video_name ,img.keyframe_id,  ClipConfig,  setImageSimiResult, setImageSimformVisible)
                  }} 
                   alt="img-sim">
              </img>
              {img.video_name} {extract_name_img(img.video_name, img.keyframe_id)}
            </div>
          ))}
        </div>
       
      </div>
    </div>
  );

  return (
    <div className="block w-screen" style={style}>
      {formVisible && renderNextImagesForm()}
      <div className={`overflow-y-auto flex-col ${ImageSimformVisible ? 'h-1/2' : 'h-full'} divide-solid transition-all duration-300`}>
        
        {ImageSimformVisible && (
            <div className="h-1/2 w-full">
              <label>Image similarity</label>
              {renderImagesSimilarityForm()}
            </div>
          )}
        <label>Result</label>

        {/* For CLIP search,  OCR and Object Detection */}
        {displayResult && searchMode === 'text' && (
          <div className="overflow-y-auto h-screen" ref={scrollContainerRef}>
            <div className="grid grid-cols-4 gap-2">
              {displayResult.map((item, index) => (
                <div
                key={index}
                className={`border p-1 bg-white ${selectedImage === `${item.video_name}-${item.keyframe_id}` ? 'border-4 border-red-500' : 'border-gray-300'}`}
                >
                  <img
                    src={`${process.env.REACT_APP_IMAGE_PATH}/Keyframes_${item.video_name.slice(0, 3)}/${item.video_name}/${extract_name_img(item.video_name, item.keyframe_id)}`}
                    className="w-full h-auto"
                    alt={item.keyframe_id}
                    onClick={() =>handleImageClick(item.video_name, item.keyframe_id)}
                    onDoubleClick={() => handleDoubleClick(item.video_name, item.keyframe_id)}
                  
                  />
                  <img className="w-8 p-0.5 rounded-md  hover:bg-black" 
                           src={'./imgSim.png'} 
                           onClick={() => {
                              handleClickImgSim(item.video_name ,item.keyframe_id,  ClipConfig,  setImageSimiResult, setImageSimformVisible)
                            }} 
                           alt="img-sim"></img>


                  {item.video_name} {extract_name_img(item.video_name, item.keyframe_id)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* For ASR search */}
        {displayResult && searchMode === 'asr' && (
          <div className="overflow-y-auto h-screen" ref={scrollContainerRef}>
            {displayResult.map((item, index) => (
              <div key={index} className="border border-gray-300 p-1 bg-white my-2">
                <div className="grid grid-cols-5 gap-2 " >
                  {item.keyframe_id.map((key_id, index) => (
                    <div> 
                      <img
                      src={`${process.env.REACT_APP_IMAGE_PATH}/Keyframes_${item.video_name.slice(0, 3)}/${item.video_name}/${extract_name_img(item.video_name, key_id)}`}
                      className={`w-full h-auto ${selectedImage === `${item.video_name}-${key_id}` ? 'border-4 border-red-500' : 'border-gray-300'}`}
                      alt={key_id}
                      onClick={() =>handleImageClick(item.video_name, key_id)}
                      onDoubleClick={() => handleDoubleClick(item.video_name, key_id)}
                      />

                      <img className="w-8 p-0.5 rounded-md  hover:bg-black" 
                           src={'./imgSim.png'} 
                           onClick={() =>{

                            handleClickImgSim(item.video_name ,item.keyframe_id,  ClipConfig,  setImageSimiResult, setImageSimformVisible)
                          }}
                           alt="img-sim"></img>
                      
                      
                  
                    
                      {item.video_name} {extract_name_img(item.video_name, key_id)}
                    </div>
            
                  ))}
                 
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
