import axios from "axios";

class OBDetService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:8000/', 
    });
  }

  async sendOBDetRequest(query, numImages, model) {
    try {
      const response = await this.axiosInstance.post('/obdetsearch', {
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

const OBDetservice = new OBDetService();
export default OBDetservice;

