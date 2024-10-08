import axios from "axios";

class OcrService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
    });
  }


  async sendOcrRequest(query, numImages, OCRMode) {
    console.log("Request", query, numImages, OCRMode)
    try {
      const response = await this.axiosInstance.post('/search_OCR', {
        "query": query,
        "topk": numImages,
        "mode": OCRMode
      });

      console.log("OCR result", response.data)
      return { data: response.data, status: response.status };
    } catch (error) {
      const status = error.response ? error.response.status : null;
      const message = "OCR search" + error.response ? error.response.data.detail : 'Network error';
      throw { status, message };
    }
  }
}

const OCRservice = new OcrService()
export default OCRservice;
