import axios from "axios";

class OBDetService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL, 
    });
  }

  async sendOBDetRequest(query, numImages, ObtDetMode) {
    try {
      console.log({
        "query": [query],
        "k": numImages, 
        "mode" : ObtDetMode
      })
      
      const response = await this.axiosInstance.post('/search_ObjectCount', {
        "query": [query],
        "k": numImages, 
        "mode" : ObtDetMode
      });

      
      return { data: response.data, status: response.status };
    } catch (error) {
      const status = error.response ? error.response.status : null;
      const message = "Object detection search" + error.response ? error.response.data.detail : 'Network error';
      throw { status, message };
    }
  }
}

const OBDetservice = new OBDetService();
export default OBDetservice;

