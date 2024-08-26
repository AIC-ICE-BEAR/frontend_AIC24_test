// utils/requestHandlers.js
import { toast } from 'react-toastify';
import Clipservice from '../services/ClipService';  // Update paths as needed
import OCRservice from '../services/OCRservice';
import ASRservice from '../services/ASRservice';
import OBDetservice from '../services/OBDetservice';
import ImgSimiLarservice from '../services/ImageSimiService'

// handleKeyPressCLIP function
export const handleKeyPressCLIP = async (e, Textquery, numImages, ModelSelect, QueryLanguage, setSearchResult, setSearchMode) => {
  if (e.key === 'Enter') {
    console.log("send request clip");

    const toastId = toast.loading("Sending request...");

    try {
      const response = await Clipservice.sendClipRequest(Textquery, numImages, ModelSelect, QueryLanguage);
      
      toast.update(toastId, {
        render: "Request successful!",
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

      setSearchResult(response.data.search_result);
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
export const handleKeyPressOCR = async (e, OCRquery, numImages, setOCRResult, setSearchMode) => {
  if (e.key === 'Enter') {
    console.log("send request OCR");

    const toastId = toast.loading("Sending request...");

    try {
      const response = await OCRservice.sendOcrRequest(OCRquery, numImages);
      
      toast.update(toastId, {
        render: "Request successful!",
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

      setOCRResult(response.data.search_result);
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

      setASRResult(response.data.search_result);
      setSearchMode('asr');
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

      setOBDetResult(response.data.search_result);
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


// image similarity function
export const handleClickImgSim = async ( image, key_id, ClipConfig,  setImageSimiResult, setImageSimformVisible) => {

    const splits = ClipConfig.split("#"); 
    const model = splits[0]
    const numImages = parseInt(splits[1])
  
    const toastId = toast.loading("Sending request...");
    console.log("request",image, key_id , numImages, model )
    try {
      const response = await ImgSimiLarservice.sendImgSimiLarRequest( image, key_id, numImages, model);

      toast.update(toastId, {
        render: "Request successful!",
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

      console.log("response image similariy" , response.data.search_result);
      setImageSimiResult(response.data.search_result)
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