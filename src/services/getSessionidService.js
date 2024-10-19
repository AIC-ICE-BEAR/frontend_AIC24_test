import axios from "axios";

class SessionIDService {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'https://eventretrieval.one/api/v2',
        });
    }

    async getsessionID() {


        try {
            const response = await this.axiosInstance.post('/login',
                {
                    "username": process.env.REACT_APP_TEAM_ID,
                    "password": process.env.REACT_APP_AIC_PASSWORD
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


    async getEvaluationID(session) {

        try {
            const response = await this.axiosInstance.get(`/client/evaluation/list?session=${session}`,

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

const sessionservice = new SessionIDService();
export default sessionservice;





