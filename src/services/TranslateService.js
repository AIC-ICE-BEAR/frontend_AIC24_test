import axios from "axios";

class TranslateService {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_BASE_URL,
        });
    }

    async sendTranslateRequest(queries) {
        try {
            const response = await this.axiosInstance.post('/translate', {
                "texts": queries,

            });

            return { data: response.data, status: response.status };
        } catch (error) {
            const status = error.response ? error.response.status : null;
            const message = "Translate" + error.response ? error.response.data.detail : 'Network error';
            throw { status, message };
        }
    }
}

const transalteservice = new TranslateService();
export default transalteservice;

