import axios from "axios";

class ObjectColorService {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_BASE_URL,
        });
    }

    async sendObjectColorRequest(query, numImages) {
        try {

            console.log({
                "query": query,
                "k": numImages

            })

            const response = await this.axiosInstance.post('/search_ObjectColor', {
                "query": query,
                "topk": numImages

            });


            return { data: response.data, status: response.status };
        } catch (error) {
            const status = error.response ? error.response.status : null;
            const message = "Object detection search" + error.response ? error.response.data.detail : 'Network error';
            throw { status, message };
        }
    }
}

const ObjectColorservice = new ObjectColorService();
export default ObjectColorservice;

