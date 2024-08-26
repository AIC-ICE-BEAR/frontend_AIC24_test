import axios from "axios";

class ClipService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL, 
    });
  }

  async sendClipRequest(query, numImages, model, language) {
    try {
      const response = await this.axiosInstance.post('/search', {
        "query": [query],
        "k": numImages,
        "model": model, 
        "language": language
      });
      console.log("Clip search", response.data)
      return { data: response.data, status: response.status };
    } catch (error) {
      const status = error.response ? error.response.status : null;
      const message = "Clip search" + error.response ? error.response.data.detail : 'Network error';
      throw { status, message };
    }
  }
}

const Clipservice = new ClipService();
export default Clipservice;

