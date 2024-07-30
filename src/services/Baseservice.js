import axios from "axios";

class BaseService {
	axiosInstance;

	constructor() {
		this.axiosInstance = axios.create({
			baseURL: import.meta.env.VITE_BASE_URL,
			timeout: 2000,
		})
	}

	withToken(token) {
		this.axiosInstance.defaults.headers.common['Authorization'] = "Token " + token;
	}
}

export default BaseService;