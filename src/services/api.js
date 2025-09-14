import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:8002/", // Assuming the backend is running on port 5000
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	config.headers["X-Tenant"] = "course";
	return config;
});

export default api;
