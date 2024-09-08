import React, { useState, useEffect, useRef } from 'react';
import { useSearchResult } from '../contexts/ClipsearchContext';
import { useOCRSearchResult } from '../contexts/OCRsearchContext';
import { useOBDetResult } from '../contexts/OBDetsearchContext';
import { useASRSearchResult } from '../contexts/ASRsearchContext';
import { useModeContext } from '../contexts/searchModeContext';
import { useClipConfig } from '../contexts/ClipSearchConfigContext';
import { useSubmitContext } from '../contexts/SubmitImageContext';
import { handleClickImgSim } from './utils/ServicesUtils'
import renderNextImagesForm from './RenderForms/NextImages'
import renderImagesSimilarityForm from './RenderForms/ImgSimilarity'
import { VideoModal } from './RenderForms/VideoForm'
import { mapKeyframe, createCSV } from './utils/utils'



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
      "keyframe_id": [1, 2, 3, 4, 5],
      "text": "tia X gọi là chủ cắt lớp tương phản pha phân cấp Hip City"
    },
    {
      "video_name": "L02_V002",
      "keyframe_id": [1, 2, 3, 4, 5],
      "text": "Thực sự đây là kỹ thuật mà chúng tôi đã chờ đợi trong nhiều năm"
    }
  ]);
  const [formVisible, setFormVisible] = useState(false);
  const [watchVideoformVisible, setwatchVideoformVisible] = useState(false);
  const [ImageSimformVisible, setImageSimformVisible] = useState(false);
  const [ImageSimiResult, setImageSimiResult] = useState([]);
  const [nextImages, setNextImages] = useState([]);
  const [selectedImage, setselectgedImage] = useState();
  const [selectedVideo, setSelectedVideo] = useState({ video_name: "", frame_idx: 0 });
  const { ClipConfig } = useClipConfig();

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

  }, [OCRResult]);

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




  const handleDoubleClick = (vid_name, start_id) => {
    const nextImages = [];
    for (let i = -10; i <= 10; i++) {
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
        console.log("mapped keyframe", result);
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

  const handlePlayVideoClick = (video_name, frame_idx) => {

    setSelectedVideo({ video_name, frame_idx });
    setwatchVideoformVisible(true);
  };









  return (
    <div className="block w-screen" style={style}>
      {formVisible && renderNextImagesForm(nextImages, selectedImage, handleImageClick, handleDoubleClick, setFormVisible)}

      {watchVideoformVisible && (
        <VideoModal
          currentVideo={selectedVideo}
          setCurrentVideo={setSelectedVideo}
          setwatchVideoformVisible={setwatchVideoformVisible}
        />
      )}


      <div className={`overflow-y-auto flex-col ${ImageSimformVisible ? 'h-1/2' : 'h-full'} divide-solid transition-all duration-300`}>

        {ImageSimformVisible && (
          <div className="h-1/2 w-full">
            <label>Image similarity</label>
            {renderImagesSimilarityForm(ImageSimiResult, setImageSimformVisible, selectedImage, handleImageClick, handleDoubleClick, handleClickImgSim, ClipConfig, setImageSimiResult, handlePlayVideoClick)}
          </div>
        )}
        <div className="flex flex-col">
          <label className='justify-center'>Result</label>
          <div className="flex justify-end">
            <button className="p-4 py-1 bg-gray-300 text-black border-black border-2 rounded"
              onClick={() => {
                if (displayResult.length === 0) {
                  console.log("displayResult not found")
                }
                else {
                  if (searchMode === "asr") {
                    console.log("Not the correct mode")
                  }
                  else {
                    createCSV(displayResult)
                  }

                }

              }}>
              Create CSV
            </button>
          </div>
        </div>


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
                    src={`${process.env.REACT_APP_IMAGE_PATH}/${item.video_name}/${item.keyframe_id}.jpg`}
                    className="w-full h-auto"
                    alt={item.keyframe_id}
                    onClick={() => handleImageClick(item.video_name, item.keyframe_id)}
                    onDoubleClick={() => handleDoubleClick(item.video_name, item.keyframe_id)}

                  />

                  <div className='flex'>
                    <img className="w-8 p-0.5 rounded-md  hover:bg-black"
                      src={'./imgSim.png'}
                      onClick={() => {
                        handleClickImgSim(item.video_name, item.keyframe_id, ClipConfig, setImageSimiResult, setImageSimformVisible)
                      }}
                      alt="img-sim"></img>

                    <img className="w-8 p-0.5 rounded-md  hover:bg-black"
                      src={'./play_button.jpg'}
                      onClick={() => {

                        handlePlayVideoClick(item.video_name, item.keyframe_id)
                      }}
                      alt="vid-watch">

                    </img>

                    <img className="w-8 p-0.5 rounded-md  hover:bg-black"

                      src={'./image_icon.jpg'}

                      onClick={() => {

                        handleDoubleClick(item.video_name, item.keyframe_id)
                      }}
                      alt="vid-watch">

                    </img>

                  </div>




                  {item.video_name} {item.keyframe_id}.jpg

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
                        src={`${process.env.REACT_APP_IMAGE_PATH}/${item.video_name}/${key_id}.jpg`}
                        className={`w-full h-auto ${selectedImage === `${item.video_name}-${key_id}` ? 'border-4 border-red-500' : 'border-gray-300'}`}
                        alt={key_id}
                        onClick={() => handleImageClick(item.video_name, key_id)}
                        onDoubleClick={() => handleDoubleClick(item.video_name, key_id)}
                      />

                      <div className='flex'>
                        <img className="w-8 p-0.5 rounded-md  hover:bg-black"
                          src={'./imgSim.png'}
                          onClick={() => {

                            handleClickImgSim(item.video_name, key_id, ClipConfig, setImageSimiResult, setImageSimformVisible)
                          }}
                          alt="img-sim">

                        </img>

                        <img className="w-8 p-0.5 rounded-md  hover:bg-black"
                          src={'./play_button.jpg'}
                          onClick={() => {

                            handlePlayVideoClick(item.video_name, key_id)
                          }}
                          alt="vid-watch">

                        </img>

                        <img className="w-8 p-0.5 rounded-md  hover:bg-black"

                          src={'./image_icon.jpg'}

                          onClick={() => {

                            handleDoubleClick(item.video_name, key_id)
                          }}
                          alt="vid-watch">

                        </img>
                      </div>





                      {item.video_name} {key_id}.jpg
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
