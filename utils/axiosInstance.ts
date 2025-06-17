import axios, { AxiosError, AxiosResponse } from 'axios';

const AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL!,
});

AxiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        return response;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);

export default AxiosInstance;
