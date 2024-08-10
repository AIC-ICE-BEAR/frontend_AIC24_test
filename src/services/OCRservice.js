import axios from "axios";

class OcrService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL, 
    });
  }


  async sendOcrRequest(query, numImages) {
    try {
      const response = await this.axiosInstance.post('/search_OCR', {
        "query": [query],
        "k": numImages
      });
      return response.data;
    } catch (error) {
      const status = error.response ? error.response.status : null;
      const message = "OCR search" + error.response ? error.response.data.detail : 'Network error';
      throw { status, message };
    }
  }
}

const OCRservice = new OcrService()
export default OCRservice;
