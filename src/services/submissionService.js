import axios from "axios";

class SubmissionService {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_SUBMISSION,
        });
    }

    async sendKISRequest(videoName, time, sessionId, evaluationid) {

        console.log("Sent", videoName, time)
        try {
            const response = await this.axiosInstance.post(`${evaluationid}`,
                {
                    "answerSets": [
                        {
                            "answers": [
                                {
                                    "mediaItemName": videoName,
                                    "start": time,
                                    "end": time
                                }
                            ]
                        }
                    ]
                },
                {
                    params: { session: sessionId } // Add sessionID as a query parameter
                }
            );
            console.log("Dres response", response.data)
            return { data: response.data, status: response.status };
        } catch (error) {
            const status = error.response ? error.response.status : null;
            const message = "Dres response" + error.response ? error.response.data.detail : 'Network error';
            throw { status, message };
        }
    }


    async sendVQARequest(videoName, time, vqaAnswer, sessionId, evaluationid) {
        console.log("Sent", videoName, time, vqaAnswer)

        try {
            const response = await this.axiosInstance.post(`${evaluationid}`,
                {
                    "answerSets": [
                        {
                            "answers": [
                                {
                                    "text": `${vqaAnswer}-${videoName}-${time}`
                                }
                            ]
                        }
                    ]
                },
                {
                    params: { session: sessionId }
                }
            );
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

