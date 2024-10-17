import React, { useState, useEffect, useRef } from 'react';
import Switch from "react-switch";
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
import { handleKeyPressSubmissionQA, handleKeyPressSubmissionKIS } from './utils/ServicesUtils'
import sessionservice from '../services/getSessionidService'
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

  const [sessionId, setsessionId] = useState(process.env.REACT_APP_SESSIONID)
  const [evaluationid, setevaluationid] = useState(process.env.REACT_APP_EVALID)

  const { FBImage, setFBImage } = useFeedbackImage();
  const { Submission, setSubmission } = useSubmitContext();


  // session id sidebar
  const [isOpen, setIsOpen] = useState(false);



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


    const time = await getPTS_Time(vid_name, keyframe);

    const roundedTime = Number(time).toFixed(3)

    const image_value_submit = {
      video_name: vid_name,
      time: roundedTime
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

  const handleVQASubmitClick = async (vid_name, time, answer) => {

    const video_name = vid_name.split('/')[1]

    handleKeyPressSubmissionQA(video_name, time, answer, sessionId, evaluationid)

  };

  const handleKISSubmitClick = async (vid_name, time) => {

    const video_name = vid_name.split('/')[1]

    handleKeyPressSubmissionKIS(video_name, time, sessionId, evaluationid)

  };

  const submitSelectedImageClick = async (vid_name, keyframe) => {
    const time = await getPTS_Time(vid_name, keyframe);

    const roundedTime = Number(time).toFixed(3)


    const image_value_submit = {
      video_name: vid_name,
      time: roundedTime
    }

    setSubmission(image_value_submit)
    const video_name = vid_name.split('/')[1]

    handleKeyPressSubmissionKIS(video_name, roundedTime, sessionId, evaluationid)

  };

  const submitSelectedImage = async () => {
    const splits = selectedImage.split('-')
    const time = await getPTS_Time(splits[0], splits[1]);

    const roundedTime = Number(time).toFixed(3);
    const image_value_submit = {
      video_name: splits[0],
      time: roundedTime
    }

    setSubmission(image_value_submit)

  };



  const handleImageClick = (vid_name, start_id) => {
    // this will handle image selection and submission
    setselectgedImage(`${vid_name}-${start_id}`);
  };

  const handlePlayVideoClick = (video_name, frame_idx) => {

    setSelectedVideo({ video_name, frame_idx });
    setwatchVideoformVisible(true);
  };


  const handleSessionIDClick = async () => {
    const sessionID = await sessionservice.getsessionID()
    const response = await sessionservice.getEvaluationID()
    setsessionId(sessionID.data.sessionId)
    setevaluationid(response.data[0].id)
  }

  const getkeyframe = async (videoName, imageId) => {
    const result = await mapKeyframe(videoName, imageId);

    return result.frameIdx
  }

  const getPTS_Time = async (videoName, imageId) => {
    const result = await mapKeyframe(videoName, imageId);

    return result.pts_time
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

        <div className='flex justify-between'>

          <div className="flex items-center justify-center my-4 gap-2">
            <label>KIS</label>
            <Switch onChange={handleModeSwitch} checked={IsModeSwitchChecked} />
            <label>VQA</label>
          </div>


          {/* The button to open the sidebar */}
          <button
            className="py-2 px-4 bg-blue-800 text-white rounded"
            onClick={() => setIsOpen(true)}
          >
            Get session id
          </button>



          <div className={`absolute z-5 top-0 right-0 w-64 h-full bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

            <div className="flex justify-between items-center mb-4">

              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                &#10005;
              </button>
            </div>

            <button
              className="py-2 px-4 bg-blue-500 text-white rounded mb-4"
              onClick={() => handleSessionIDClick()}
            >
              Get Id
            </button>

            <div className="flex flex-col space-y-2">
              Session id
              <input
                className="shadow appearance-none border-2 rounded py-2 px-2"
                placeholder={`Session id`}
                value={sessionId}
                onChange={(e) => setsessionId(e.target.value)}
              />
              Evaluation id
              <input
                className="shadow appearance-none border-2 rounded py-2 px-2"
                placeholder={`Eval id`}
                value={evaluationid}
                onChange={(e) => setevaluationid(e.target.value)}
              />
            </div>

          </div>




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
              value={Submission.time}
              onChange={(e) => {
                setSubmission(prevState => ({
                  ...prevState,
                  time: e.target.value
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
                onClick={() => handleVQASubmitClick(Submission.video_name, Submission.time, vqaAnswer)}

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
              value={Submission.time}
              onChange={(e) => {
                setSubmission(prevState => ({
                  ...prevState,
                  time: e.target.value
                }))
              }}

            />

            <div className='flex '>
              <button
                className="mt-4 py-2 px-2 bg-blue-500 text-white rounded"
                onClick={() => handleKISSubmitClick(Submission.video_name, Submission.time)}
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
            submitSelectedImageClick={submitSelectedImageClick}
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
            submitSelectedImageClick={submitSelectedImageClick}
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
            submitSelectedImageClick={submitSelectedImageClick}
          />
        )}


      </div>
    </div>
  );
}

export default DisplayResult;
