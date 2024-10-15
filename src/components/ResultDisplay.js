import React, { useState, useEffect, useRef } from 'react';
import Switch from "react-switch";
import { toast } from 'react-toastify';
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
import submissionservice from '../services/submissionService';
import renderNextImagesForm from './RenderForms/NextImages'
import renderImagesSimilarityForm from './RenderForms/ImgSimilarity'
import { VideoModal } from './RenderForms/VideoForm'
import { mapKeyframe, createCSV, findImageFromFrameIdx } from './utils/utils'
import { FaSearch } from "react-icons/fa";
import { FaPaperPlane } from "react-icons/fa6";
import { useFeedbackImage } from '../contexts/ImagesFeedBack'


// Imports other display results forms 
import TextSearchResult from './Displays/TextSearchResult';
import TemporalSearchResult from './Displays/TemporalSearchResult';
import ASRSearchResult from './Displays/ASRSearchResult';


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






  const [IsModeSwitchChecked, setIsModeSwitchChecked] = useState(false)
  const [submissionMode, setsubmissionMode] = useState('kis')


  // For image submission
  const [vqaAnswer, setvqaAnswer] = useState()

  const { FBImage, setFBImage } = useFeedbackImage();
  const { Submission, setSubmission } = useSubmitContext();


  const handleModeSwitch = (checked) => {
    setIsModeSwitchChecked(checked);
    setsubmissionMode(checked ? "vqa" : "kis");
  };


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


  const handleVQAClick = async (vid_name, keyframe) => {
    const image_value = {
      video_name: vid_name,
      keyframe: keyframe
    }

    setVQAImage([...VQAImage, image_value])


    const mapkeyframe = await getkeyframe(vid_name, keyframe);

    const image_value_submit = {
      video_name: vid_name,
      frame_idx: mapkeyframe
    }

    setSubmission(image_value_submit)
  };







  const handleLikeClick = (video_name, keyframe_id) => {
    setFBImage(`+f ${video_name} ${keyframe_id}`)
  }

  const handleDisLikeClick = (video_name, keyframe_id) => {
    setFBImage(`-f ${video_name} ${keyframe_id}`)
  }


  // Submission components

  const handleVQASubmitClick = async (vid_name, keyframe, answer) => {

    const video_name = vid_name.split('/')[1]

    const toastId = toast.loading("Sending request...");

    try {
      const response = await submissionservice.sendVQARequest(video_name, keyframe, answer)
      console.log("Dres response", response.data)
      toast.update(toastId, {
        render: "Request successful!",
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });


      return { data: response.data, status: response.status };
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: `Error: ${error.message || 'Failed'}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }


  };


  const handleKISSubmitClick = async (vid_name, keyframe) => {

    const video_name = vid_name.split('/')[1]
    console.log("submitted", video_name, keyframe)

    const toastId = toast.loading("Sending request...");

    try {
      const response = await submissionservice.sendKISRequest(video_name, keyframe)
      toast.update(toastId, {
        render: "Request successful!",
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
      return { data: response.data, status: response.status };
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: `Error: ${error.message || 'Failed'}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }

  };



  const submitSelectedImage = async () => {
    const splits = selectedImage.split('-')
    const mapkeyframe = await getkeyframe(splits[0], splits[1]);

    const image_value_submit = {
      video_name: splits[0],
      frame_idx: mapkeyframe
    }

    setSubmission(image_value_submit)

    const toastId = toast.loading("Sending request...");


    try {
      const response = await submissionservice.sendKISRequest(splits[0], mapkeyframe)
      toast.update(toastId, {
        render: "Request successful!",
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
      return { data: response.data, status: response.status };
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: `Error: ${error.message || 'Failed'}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }


  };



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

        <div className="flex items-center justify-center my-4 gap-2">
          <label>KIS</label>
          <Switch onChange={handleModeSwitch} checked={IsModeSwitchChecked} />
          <label>VQA</label>
        </div>
        {submissionMode === 'vqa' ? (
          <div className='flex pb-10 w-1/2 items-center'>
            <p className='w-full px-2 py-2'>QA submission</p>

            <input
              className="shadow appearance-none border-2 rounded w-full py-2 px-2 flex-grow"
              placeholder={`Enter video name`}
              value={Submission.video_name}
              onChange={(e) => {
                setSubmission(prevState => ({
                  ...prevState,
                  video_name: e.target.value
                }))
              }}


            />

            <input
              className="shadow appearance-none border-2 rounded w-full py-2 px-2 flex-grow"
              placeholder={`Enter Frameidx`}
              value={Submission.frame_idx}
              onChange={(e) => {
                setSubmission(prevState => ({
                  ...prevState,
                  frame_idx: e.target.value
                }))
              }}

            />

            <input
              className="shadow appearance-none border-2 rounded w-full py-2 px-2 flex-grow"
              placeholder={`Enter Answer`}
              value={vqaAnswer}
              onChange={(e) => setvqaAnswer(e.target.value)}

            />
            <div className='flex '>
              <button
                className="mt-4 py-2 px-2 bg-blue-500 text-white rounded"
                onClick={() => handleVQASubmitClick(Submission.video_name, Submission.frame_idx, vqaAnswer)}

              >
                <FaPaperPlane />
              </button>


            </div>
          </div>
        ) : (
          <div className='flex pb-10 w-1/2 items-center'>
            <p className='w-full px-2 py-2'>KIS submission</p>

            <input
              className="shadow appearance-none border-2 rounded w-full py-2 px-2 flex-grow"
              placeholder={`Enter video name`}
              value={Submission.video_name}
              onChange={(e) => {
                setSubmission(prevState => ({
                  ...prevState,
                  video_name: e.target.value
                }))
              }}


            />

            <input
              className="shadow appearance-none border-2 rounded w-full py-2 px-2 flex-grow"
              placeholder={`Enter Frameidx`}
              value={Submission.frame_idx}
              onChange={(e) => {
                setSubmission(prevState => ({
                  ...prevState,
                  frame_idx: e.target.value
                }))
              }}

            />

            <div className='flex '>
              <button
                className="mt-4 py-2 px-2 bg-blue-500 text-white rounded"
                onClick={() => handleKISSubmitClick(Submission.video_name, Submission.frame_idx)}
              >
                <FaPaperPlane />
              </button>


            </div>


          </div>
        )}





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
