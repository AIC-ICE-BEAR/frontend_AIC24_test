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
    console.log("send request OBdet");

    const toastId = toast.loading("Sending request...");
    console.log("dropped items", { 'Items': droppedItems, 'k': numImages })

    // try {
    //   const response = await ObjectColorservice.sendObjectColorRequest(OBDetquery, numImages);

    //   toast.update(toastId, {
    //     render: "Request successful!",
    //     type: 'success',
    //     isLoading: false,
    //     autoClose: 3000
    //   });

    //   setOBDetResult(response.data.results);
    //   setSearchMode('text');
    // } catch (error) {
    //   console.log(error);
    //   toast.update(toastId, {
    //     render: `Error: ${error.message || 'Failed'}`,
    //     type: 'error',
    //     isLoading: false,
    //     autoClose: 3000
    //   });
    // }
  }
};




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



export const handleKeyPressFused = async (e, queries, numImages, ModelSelect, setSearchResult, setSearchMode) => {
  if (e.key === 'Enter') {
    console.log("send request Fused");
    console.log("queries", queries)
    console.log("Num images", numImages)

    const toastId = toast.loading("Sending request...");

    try {
      const response = await fusedservice.sendFusedRequest(queries, numImages, ModelSelect);

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

export const handleKeyPressTemporal = async (e, queries, numImages, match_first, TemporalMetric, QueryLanguage, ModelSelect, setSearchResult, setSearchMode) => {
  if (e.key === 'Enter') {


    const toastId = toast.loading("Sending request...");

    try {
      const response = await temporalservice.sendTemporalRequest(queries, numImages, QueryLanguage, match_first, TemporalMetric, ModelSelect);

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



export const handleKeyPressTranslate = async (e, queries, setTranslateResult) => {
  if (e.key === 'Enter') {
    try {
      const response = await transalteservice.sendTranslateRequest(queries);
      setTranslateResult(response.data.texts);
      return response.data.texts
    } catch (error) {
      console.log(error);

    }
  }
};