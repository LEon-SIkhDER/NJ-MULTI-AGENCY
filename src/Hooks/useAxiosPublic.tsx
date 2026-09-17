import axios from "axios";

export const baseURL = import.meta.env.VITE_API_URL;

export const axiosPublic = axios.create({
    baseURL: baseURL,
});

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;
