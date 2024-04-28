import * as axios from "axios";
import {AxiosInstance, CreateAxiosDefaults} from "axios";

const config: CreateAxiosDefaults = {
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
}

const instance: AxiosInstance = axios.create(config);
