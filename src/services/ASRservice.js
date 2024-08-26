import axios from "axios";

class ASRService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL, 
    });
  }

  async sendASRRequest(query, mode, numImages) {
    try {
      const response = await this.axiosInstance.post('/search_ASR', {
        "query": query,
        "k": numImages,
        "mode": mode
      });

      console.log("ASR result", response.data)
      return { data: response.data, status: response.status };
    } catch (error) {
      const status = error.response ? error.response.status : null;
      const message ="ASR search" + error.response ? error.response.data.detail : 'Network error';
      throw { status, message };
    }
  }
}

const ASRservice = new ASRService();
export default ASRservice;

