import axios from "axios";

const instance = axios.create({
  baseURL: "https://chatgpt-project-1-z3al.onrender.com", // Replace with your actual backend URL
  withCredentials: true, // If you use cookies for auth
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;