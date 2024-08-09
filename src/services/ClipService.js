import axios from "axios";

class ClipService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://34.87.152.224:8000/', 
    });
  }

  async sendClipRequest(query, numImages, model) {
    try {
      const response = await this.axiosInstance.post('/search', {
        "query": [query],
        "k": numImages,
        "model": model
      });
      return { data: response.data, status: response.status };
    } catch (error) {
      const status = error.response ? error.response.status : null;
      const message = error.response ? error.response.data.detail : 'Network error';
      throw { status, message };
    }
  }
}

const Clipservice = new ClipService();
export default Clipservice;

