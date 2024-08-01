import BaseService from './BaseService';

class OcrService extends BaseService {
  async sendOcrRequest(query, numImages) {
    try {
      const response = await this.axiosInstance.post('/search_OCR', {
        query: [query],
        k: numImages
      });
      return response.data;
    } catch (error) {
      throw error.response ? new Error(error.response.data.detail) : new Error('Network error');
    }
  }
}

const OCRservice = new OcrService()
export default OCRservice;
