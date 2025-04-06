import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;
const tenantId = import.meta.env.VITE_TENANT_ID;

export const endpoints = {
    event: {
        get_events: `/event/`,
        create_update: `/event/createUpdate`,
        delete_event: `/event/delete`
    },
};

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
        'X-Tenant-ID': tenantId,
        'myheader': "123ABC"
    },
});

const getRequest = async (endpoint: string, query: string) => {
    const response = await axiosInstance.get(`${endpoint}?${query}`);
    return response.data;
};

const postRequest = async (endpoint: string, payload: any) => {
    const response = await axiosInstance.post(endpoint, payload);
    return response.data;
};

export { getRequest, postRequest };
