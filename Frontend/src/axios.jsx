import axios from "axios";

const instance = axios.create({
  baseURL: "https://chatgpt-project-1-z3al.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  // Add timeout and other configurations
  timeout: 5000,
});

// Add response interceptor to handle errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default instance;