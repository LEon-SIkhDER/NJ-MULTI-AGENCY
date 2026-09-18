import axios from "axios";

export const baseURL =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_SERVER_URL ||
    (import.meta.env.PROD
        ? "https://ex.njmultiagency.site"
        : "http://localhost:5000");

export const axiosPublic = axios.create({
    baseURL: baseURL,
});

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;
