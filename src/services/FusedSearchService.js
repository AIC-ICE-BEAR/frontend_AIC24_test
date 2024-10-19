import axios from "axios";

class FusedService {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_BASE_URL,
        });
    }

    async sendFusedRequest(queries, numImages, QueryLanguage, model, SplitMode) {
        try {
            const response = await this.axiosInstance.post('/fuse_search', {
                "query": queries,
                "topk": numImages,
                "model": model,
                "language": QueryLanguage,
                "gpt_split": SplitMode,

            });
            console.log("Fused search", response.data)
            return { data: response.data, status: response.status };
        } catch (error) {
            const status = error.response ? error.response.status : null;
            const message = "Fused search" + error.response ? error.response.data.detail : 'Network error';
            throw { status, message };
        }
    }
}

const fusedservice = new FusedService();
export default fusedservice;

