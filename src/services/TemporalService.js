import axios from "axios";

class TemporalService {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_BASE_URL,
        });
    }

    async sendTemporalRequest(queries, numImages, QueryLanguage, match_first, TemporalMetric, model) {
        try {
            const response = await this.axiosInstance.post('/temporal_search', {
                "query": queries,
                "topk": numImages,
                "model": model,
                "language": QueryLanguage,
                "metric": TemporalMetric,
                "match_first": match_first

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

