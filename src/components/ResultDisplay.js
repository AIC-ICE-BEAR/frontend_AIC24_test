import React, { useState, useEffect, useRef } from 'react';
import { useSearchResult } from '../contexts/ClipsearchContext';
import { useTemporalSearchResult } from '../contexts/TemporalSearchContext'
import { useOCRSearchResult } from '../contexts/OCRsearchContext';
import { useOBDetResult } from '../contexts/OBDetsearchContext';
import { useVQASearchImage } from '../contexts/VQAImageContext'
import { useASRSearchResult } from '../contexts/ASRsearchContext';
import { useModeContext } from '../contexts/searchModeContext';
import { useClipConfig } from '../contexts/ClipSearchConfigContext';
import { useCSVPreview } from '../contexts/CSVPreviewContext'
import { useVQASearchResult } from '../contexts/VQAContext';
import { useSubmitContext } from '../contexts/SubmitImageContext';
import { handleClickImgSim } from './utils/ServicesUtils'
import renderNextImagesForm from './RenderForms/NextImages'
import renderImagesSimilarityForm from './RenderForms/ImgSimilarity'
import { VideoModal } from './RenderForms/VideoForm'
import { mapKeyframe, createCSV, findImageFromFrameIdx } from './utils/utils'
import { FaSearch } from "react-icons/fa";
import { GiPlayButton } from "react-icons/gi";
import { useFeedbackImage } from '../contexts/ImagesFeedBack'


// Imports other display results forms 
import TextSearchResult from './Displays/TextSearchResult';
import TemporalSearchResult from './Displays/TemporalSearchResult';
import ASRSearchResult from './Displays/ASRSearchResult';
import CSVPreview from './Displays/CSVPreview'

function DisplayResult({ style }) {
  // Load results from context
  const { VQAResult } = useVQASearchResult();
  const { searchResult } = useSearchResult();
  const { TemporalResult } = useTemporalSearchResult();
  const { OBDetResult } = useOBDetResult();
  const { OCRResult } = useOCRSearchResult();
  const { ASRResult } = useASRSearchResult();
  const { VQAImage, setVQAImage } = useVQASearchImage();
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
  const { submittedImages, setsubmittedImages } = useCSVPreview()

  // For image visualization 
  const [videoName, setvideoName] = useState('')
  const [frameIdx, setframeIdx] = useState('')


  // For image submission
  const { FBImage, setFBImage } = useFeedbackImage();
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

    setdisplayResult(VQAResult);

  }, [VQAResult]);

  useEffect(() => {
    setSearchMode('temporal');
    setdisplayResult(TemporalResult);
  }, [TemporalResult]);

  useEffect(() => {

    setdisplayResult(OCRResult);

  }, [OCRResult]);

  useEffect(() => {

    setSearchMode('asr');
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
    for (let i = -30; i <= 30; i++) {
      if (start_id + i <= 0) continue
      nextImages.push({
        video_name: vid_name,
        img_id: start_id + i
      });
    }
    setNextImages(nextImages);
    setFormVisible(true);
  };

  const handleOpenImageInNewTab = (video_name, keyframe_id) => {

    const imageUrl = `${process.env.REACT_APP_IMAGE_PATH}/${video_name}/${keyframe_id}.jpg`;
    window.open(imageUrl, '_blank'); // Open the image in a new tab
  };


  const handleVQAClick = (vid_name, keyframe) => {
    const image_value = {
      video_name: vid_name,
      keyframe: keyframe
    }

    console.log("sent to VQA image context", image_value)
    setVQAImage([...VQAImage, image_value])
  };

  const handleLikeClick = (video_name, keyframe_id) => {
    setFBImage(`+f ${video_name} ${keyframe_id}`)
  }

  const handleDisLikeClick = (video_name, keyframe_id) => {
    setFBImage(`-f ${video_name} ${keyframe_id}`)
  }



  const submitSelectedImage = async () => {
    const splits = selectedImage.split('-')

    mapKeyframe(splits[0], splits[1])
      .then(result => {
        console.log("mapped keyframe", result);
        submittedImages.push({ text: `${result.videoName.split('/').pop()}, ${result.frameIdx}`, image: splits[1] })

        setSubmission(result)
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleSubmissionRefresh = () => {
    setsubmittedImages([])
  }

  const handleImageClick = (vid_name, start_id) => {
    // this will handle image selection and submission
    setselectgedImage(`${vid_name}-${start_id}`);
  };

  const handlePlayVideoClick = (video_name, frame_idx) => {

    setSelectedVideo({ video_name, frame_idx });
    setwatchVideoformVisible(true);
  };

  const getkeyframe = async (videoName, imageId) => {
    const result = await mapKeyframe(videoName, imageId);

    return result.frameIdx
  }


  const handleVisualizeImage = async (video_name, frame_idx) => {
    try {
      const { videoName: vName, imageId } = await findImageFromFrameIdx(video_name, frame_idx);

      // Assuming your image URL is structured like this (modify if needed)
      const imageURL = `${process.env.REACT_APP_IMAGE_PATH}/${vName}/${imageId}.jpg`;

      // Open the image in a new tab/window
      window.open(imageURL, '_blank');
    } catch (error) {
      console.error('Error:', error.message);
    }
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

        {/* <div className='flex pb-10 w-1/2 items-center'>
          <p className='w-full px-2 py-2'>Visualize image</p>

          <input
            className="shadow appearance-none border-2 rounded w-full py-2 px-2 flex-grow"
            placeholder={`Enter video name`}
            value={videoName}
            onChange={(e) => setvideoName(e.target.value)}
          />

          <input
            className="shadow appearance-none border-2 rounded w-full py-2 px-2 flex-grow"
            placeholder={`Enter Frameidx`}
            value={frameIdx}
            onChange={(e) => setframeIdx(e.target.value)}
          />
          <div className='flex '>
            <button
              className="mt-4 py-2 px-2 bg-blue-500 text-white rounded"
              onClick={() => handleVisualizeImage(videoName, frameIdx)}
            >
              <FaSearch />
            </button>

            <button
              className="mt-4 py-2 px-2 bg-blue-500 text-white rounded"

              onClick={async () => {
                const keyframe = await findImageFromFrameIdx(videoName, frameIdx)
                handlePlayVideoClick(videoName, keyframe.imageId)
              }}
            >
              <GiPlayButton />
            </button>
          </div>
        </div> */}

        {/* <CSVPreview
          searchMode={searchMode}
          displayResult={displayResult}
          handleSubmissionRefresh={handleSubmissionRefresh}
          createCSV={createCSV}
        /> */}



        {/* For CLIP search,  OCR and Object Detection */}
        {searchMode === 'text' && (
          <TextSearchResult
            displayResult={displayResult}
            selectedImage={selectedImage}
            handleLikeClick={handleLikeClick}
            handleDisLikeClick={handleDisLikeClick}
            handleImageClick={handleImageClick}
            handleDoubleClick={handleDoubleClick}
            handleClickImgSim={handleClickImgSim}
            handleVQAClick={handleVQAClick}
            handlePlayVideoClick={handlePlayVideoClick}
            handleOpenImageInNewTab={handleOpenImageInNewTab}
            ClipConfig={ClipConfig}
            setImageSimiResult={setImageSimiResult}
            setImageSimformVisible={setImageSimformVisible}
            getkeyframe={getkeyframe}
          />
        )}


        {/* For Temporal Search */}
        {searchMode === 'temporal' && (
          <TemporalSearchResult
            displayResult={displayResult}
            selectedImage={selectedImage}
            handleImageClick={handleImageClick}
            handleDoubleClick={handleDoubleClick}
            handleClickImgSim={handleClickImgSim}
            handlePlayVideoClick={handlePlayVideoClick}
            handleVQAClick={handleVQAClick}
            handleOpenImageInNewTab={handleOpenImageInNewTab}
            ClipConfig={ClipConfig}
            setImageSimiResult={setImageSimiResult}
            setImageSimformVisible={setImageSimformVisible}
            getkeyframe={getkeyframe}
          />
        )}



        {/* For ASR search */}
        {searchMode === 'asr' && (
          <ASRSearchResult
            displayResult={displayResult}
            selectedImage={selectedImage}
            handleImageClick={handleImageClick}
            handleDoubleClick={handleDoubleClick}
            handleClickImgSim={handleClickImgSim}
            handlePlayVideoClick={handlePlayVideoClick}
            handleVQAClick={handleVQAClick}
            handleOpenImageInNewTab={handleOpenImageInNewTab}
            ClipConfig={ClipConfig}
            setImageSimiResult={setImageSimiResult}
            setImageSimformVisible={setImageSimformVisible}
            getkeyframe={getkeyframe}
          />
        )}


      </div>
    </div>
  );
}

export default DisplayResult;
