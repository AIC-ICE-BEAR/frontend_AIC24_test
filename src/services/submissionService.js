import axios from "axios";

class SubmissionService {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'localhost:btc link',
        });
    }

    async sendKISRequest(videoName, frame_idx) {
        try {
            const response = await this.axiosInstance.post('/post', {
                "video name": videoName,
                "frameidx": frame_idx
            });
            console.log("Dres response", response.data)
            return { data: response.data, status: response.status };
        } catch (error) {
            const status = error.response ? error.response.status : null;
            const message = "Dres response" + error.response ? error.response.data.detail : 'Network error';
            throw { status, message };
        }
    }


    async sendVQARequest(videoName, frame_idx, vqaAnswer) {
        try {
            const response = await this.axiosInstance.post('/post', {
                "video name": videoName,
                "frameidx": frame_idx,
                "answer": vqaAnswer
            });
            console.log("Dres response", response.data)
            return { data: response.data, status: response.status };
        } catch (error) {
            const status = error.response ? error.response.status : null;
            const message = "Dres response" + error.response ? error.response.data.detail : 'Network error';
            throw { status, message };
        }
    }
}

const submissionservice = new SubmissionService();
export default submissionservice;

