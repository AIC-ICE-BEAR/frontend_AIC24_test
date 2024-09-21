import React, { useState, useEffect, useRef } from 'react';
import { useSearchResult } from '../contexts/ClipsearchContext';
import { useTemporalSearchResult } from '../contexts/TemporalSearchContext'
import { useOCRSearchResult } from '../contexts/OCRsearchContext';
import { useOBDetResult } from '../contexts/OBDetsearchContext';
import { useVQASearchImage } from '../contexts/VQAImageContext'
import { useASRSearchResult } from '../contexts/ASRsearchContext';
import { useModeContext } from '../contexts/searchModeContext';
import { useClipConfig } from '../contexts/ClipSearchConfigContext';
import { useVQASearchResult } from '../contexts/VQAContext';
import { useSubmitContext } from '../contexts/SubmitImageContext';
import { handleClickImgSim } from './utils/ServicesUtils'
import renderNextImagesForm from './RenderForms/NextImages'
import renderImagesSimilarityForm from './RenderForms/ImgSimilarity'
import { VideoModal } from './RenderForms/VideoForm'
import { mapKeyframe, createCSV } from './utils/utils'
import { FaLink } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
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
  const [submittedImages, setsubmittedImages] = useState([])


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
        console.log(submittedImages)
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

        <CSVPreview
          searchMode={searchMode}
          displayResult={displayResult}
          submittedImages={submittedImages}
          handleSubmissionRefresh={handleSubmissionRefresh}
          createCSV={createCSV}
        />



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
          />
        )}


      </div>
    </div>
  );
}

export default DisplayResult;
