import axios from "axios";

class ImgSimiLarService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL, 
    });
  }

  async sendImgSimiLarRequest(image, key_id, numImages, model) {
    try {
      const response = await this.axiosInstance.post('/search_IMG', {
        "video_name": image,
        "idx": key_id, 
        "k": numImages,
        "model_name": model
      });

      console.log("image similarity", response.data)
      return { data: response.data, status: response.status };
    } catch (error) {
      const status = error.response ? error.response.status : null;
      const message = "image similar search" + error.response ? error.response.data.detail : 'Network error';
      throw { status, message };
    }
  }
}

const ImgSimiLarservice = new ImgSimiLarService();
export default ImgSimiLarservice;

