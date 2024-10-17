// utils/requestHandlers.js
import { toast } from 'react-toastify';
import Clipservice from '../../services/ClipService';  // Update paths as needed
import OCRservice from '../../services/OCRservice';
import ASRservice from '../../services/ASRservice';
import OBDetservice from '../../services/OBDetservice';
import ImgSimiLarservice from '../../services/ImageSimiService'
import fusedservice from '../../services/FusedSearchService'
import transalteservice from '../../services/TranslateService'
import ObjectColorservice from '../../services/ObjectColorService'
import temporalservice from '../../services/TemporalService'
import submissionservice from '../../services/submissionService';

// handleKeyPressCLIP function
export const handleKeyPressCLIP = async (e, Textquery, numImages, ModelSelect, QueryLanguage, setSearchResult, setSearchMode) => {
  if (e.key === 'Enter') {
    console.log("send request clip");
    console.log("Num images", numImages)

    const toastId = toast.loading("Sending request...");

    try {
      const response = await Clipservice.sendClipRequest(Textquery, numImages, ModelSelect, QueryLanguage);

      toast.update(toastId, {
        render: "Request successful!",
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

      setSearchResult(response.data.results);
      setSearchMode('text');
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: `Error: ${error.message || 'Failed'}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  }
};

// handleKeyPressOCR function
export const handleKeyPressOCR = async (e, OCRquery, numImages, OCRMode, setOCRResult, setSearchMode) => {
  if (e.key === 'Enter') {
    console.log("send request OCR");

    const toastId = toast.loading("Sending request...");

    try {
      const response = await OCRservice.sendOcrRequest(OCRquery, numImages, OCRMode);

      toast.update(toastId, {
        render: "Request successful!",
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
      setSearchMode('text');
      setOCRResult(response.data.results);

    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: `Error: ${error.message || 'Failed'}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  }
};

// handleKeyPressASR function
export const handleKeyPressASR = async (e, ASRquery, ASRMode, numImages, setASRResult, setSearchMode) => {
  if (e.key === 'Enter') {
    console.log("send request ASR");

    const toastId = toast.loading("Sending request...");
    console.log("Request", ASRquery, ASRMode, numImages)

    try {
      const response = await ASRservice.sendASRRequest(ASRquery, ASRMode, numImages);

      toast.update(toastId, {
        render: "Request successful!",
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
      // setSearchMode('asr');
      setASRResult(response.data.results);

    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: `Error: ${error.message || 'Failed'}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  }
};

// handleKeyPressOBDet function
export const handleKeyPressOBDet = async (e, OBDetquery, numImages, ObtDetMode, setOBDetResult, setSearchMode) => {
  if (e.key === 'Enter') {
    console.log("send request OBdet");

    const toastId = toast.loading("Sending request...");

    try {
      const response = await OBDetservice.sendOBDetRequest(OBDetquery, numImages, ObtDetMode);

      toast.update(toastId, {
        render: "Request successful!",
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

      setOBDetResult(response.data.results);
      setSearchMode('text');
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: `Error: ${error.message || 'Failed'}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  }
};


// handleKeyPressOBDet function
export const handleKeyPressOBJCOLOR = async (e, droppedItems, numImages, setOBDetResult, setSearchMode) => {
  if (e.key === 'Enter') {
    console.log("send request OB color");

    const toastId = toast.loading("Sending request...");
    console.log(droppedItems)
    const canvasWidth = droppedItems[0].objectDetection.canvasSize.width;
    const canvasHeight = droppedItems[0].objectDetection.canvasSize.height;

    // Helper function to normalize coordinates
    const normalizeCoord = (value, max) => value / max;

    const objectLocationQuery = {
      class_ids: [],
      box_cords: [],
      topk: numImages
    };

    // Loop over dropped items and extract the required information
    droppedItems.forEach(item => {
      const { label, objectDetection } = item;

      // Ensure objectDetection and item.id are valid
      if (!objectDetection || typeof item.id === 'undefined' || isNaN(parseInt(item.id))) {
        console.warn('Invalid item or missing id:', item);
        return; // Skip invalid items
      }

      // Normalize top left and bottom right coordinates
      const topLeft = objectDetection.topLeft;
      const bottomRight = objectDetection.bottomRight;

      const normalizedTopLeftX = normalizeCoord(topLeft.x, canvasWidth);
      const normalizedTopLeftY = normalizeCoord(topLeft.y, canvasHeight);

      const normalizedBottomRightX = normalizeCoord(bottomRight.x, canvasWidth);
      const normalizedBottomRightY = normalizeCoord(bottomRight.y, canvasHeight);

      // Push class id
      objectLocationQuery.class_ids.push(parseInt(item.id));

      // Push normalized box coordinates
      objectLocationQuery.box_cords.push([
        normalizedTopLeftX,
        normalizedTopLeftY,
        normalizedBottomRightX,
        normalizedBottomRightY
      ]);
    });


    console.log("ObjectLocationQuery:", objectLocationQuery);


    try {
      const response = await ObjectColorservice.sendObjectColorRequest(objectLocationQuery, numImages);

      console.log("Object color", response)

      toast.update(toastId, {
        render: "Request successful!",
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

      setOBDetResult(response.data.results);
      setSearchMode('text');
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: `Error: ${error.message || 'Failed'}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  }
}
  ;




// image similarity function
export const handleClickImgSim = async (image, key_id, ClipConfig, setImageSimiResult, setImageSimformVisible) => {

  const splits = ClipConfig.split("#");
  const model = splits[0]
  const numImages = parseInt(splits[1])

  const toastId = toast.loading("Sending request...");
  console.log("request", image, key_id, numImages, model)
  try {
    const response = await ImgSimiLarservice.sendImgSimiLarRequest(image, key_id, numImages, model);


    toast.update(toastId, {
      render: "Request successful!",
      type: 'success',
      isLoading: false,
      autoClose: 3000
    });

    console.log("response image similariy", response.data.results);
    setImageSimiResult(response.data.results)
    setImageSimformVisible(true)
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



export const handleKeyPressFused = async (e, queries, numImages, ModelSelect, setSearchResult, setSearchMode, SplitMode) => {
  if (e.key === 'Enter') {
    console.log("send request Fused");
    console.log("queries", queries)
    console.log("Num images", numImages)

    const toastId = toast.loading("Sending request...");

    try {
      const response = await fusedservice.sendFusedRequest(queries, numImages, ModelSelect, SplitMode);

      toast.update(toastId, {
        render: "Request successful!",
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

      setSearchResult(response.data.results);
      setSearchMode('text');
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: `Error: ${error.message || 'Failed'}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  }
};

export const handleKeyPressTemporal = async (e, queries, numImages, TemporalMetric, ModelSelect, setSearchResult, SplitMode, ImageDistance) => {
  if (e.key === 'Enter') {


    const toastId = toast.loading("Sending request...");

    try {
      const response = await temporalservice.sendTemporalRequest(queries, numImages, TemporalMetric, ModelSelect, SplitMode, ImageDistance);

      toast.update(toastId, {
        render: "Request successful!",
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

      setSearchResult(response.data.results);

    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: `Error: ${error.message || 'Failed'}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  }
};



export const handleKeyPressTranslate = async (e, queries) => {
  if (e.key === 'Enter') {
    try {
      const response = await transalteservice.sendTranslateRequest(queries);
      return response.data.texts
    } catch (error) {
      console.log(error);

    }
  }
};



export const handleKeyPressSubmissionKIS = async (video_name, time, sessionId, evaluationid) => {

  const toastId = toast.loading("Sending request...");


  try {
    const response = await submissionservice.sendKISRequest(video_name, time * 1000, sessionId, evaluationid)
    console.log("Dres response", response.data)
    if (response.data.submission == 'WRONG') {
      toast.update(toastId, {
        render: `${response.data.submission}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });


    }
    else {

      toast.update(toastId, {
        render: `${response.data.submission}`,
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

    }



    return { data: response.data, status: response.status };
  } catch (error) {

    if (error.status === 412) {
      const errorMessage = 'Duplicated answer'
      toast.update(toastId, {
        render: `Error: ${errorMessage}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
    else {
      const errorMessage = error.response && error.response.data
        ? error.response.data.description || error.response.data.detail || error.response.data.message || 'An error occurred'
        : 'Network error or no response from server';

      // Update the toast with the error message
      toast.update(toastId, {
        render: `Error: ${errorMessage}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });

    }

  }
};



export const handleKeyPressSubmissionQA = async (video_name, time, answer, sessionId, evaluationid) => {

  const toastId = toast.loading("Sending request...");



  try {
    const response = await submissionservice.sendVQARequest(video_name, time * 1000, answer, sessionId, evaluationid)
    console.log("Dres response", response.data)
    if (response.data.submission == 'WRONG') {
      toast.update(toastId, {
        render: `${response.data.submission}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });


    }
    else {

      toast.update(toastId, {
        render: `${response.data.submission}`,
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

    }



    return { data: response.data, status: response.status };
  } catch (error) {

    if (error.status === 412) {
      const errorMessage = 'Duplicated answer'
      toast.update(toastId, {
        render: `Error: ${errorMessage}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
    else {
      const errorMessage = error.response && error.response.data
        ? error.response.data.description || error.response.data.detail || error.response.data.message || 'An error occurred'
        : 'Network error or no response from server';

      // Update the toast with the error message
      toast.update(toastId, {
        render: `Error: ${errorMessage}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });

    }




  }

};