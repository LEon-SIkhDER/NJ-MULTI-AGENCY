import axios from "axios";

export const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const axiosPublic = axios.create({
    baseURL: baseURL,
});

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;
