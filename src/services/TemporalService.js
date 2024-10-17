import axios from "axios";

class TemporalService {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_BASE_URL,
        });
    }

    async sendTemporalRequest(queries, numImages, TemporalMetric, model, SplitMode, ImageDistance) {
        try {
            const response = await this.axiosInstance.post('/temporal_search', {
                "query": queries,
                "topk": numImages,
                "model": model,
                "metric": TemporalMetric,
                "gpt_split": SplitMode,
                "max_frame_dist": ImageDistance
            });
            console.log("Temporal search", response.data)
            return { data: response.data, status: response.status };
        } catch (error) {
            const status = error.response ? error.response.status : null;
            const message = "Temporal search" + error.response ? error.response.data.detail : 'Network error';
            throw { status, message };
        }
    }
}

const temporalservice = new TemporalService();
export default temporalservice;

