import axios from "axios";

class ClipService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:8000/', 
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


// class ClipService {
//   async sendClipRequest(query, numImages, model, language) {
//     try {
//       const response = await this.axiosInstance.post('http://35.240.132.220:8000/search', {
//         query: [query],
//         k: numImages,
//         model: model,
//         language: language
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response ? new Error(error.response.data.detail) : new Error('Network error');
//     }
//   }
// }
// const Clipservice = new ClipService();
// export default Clipservice
