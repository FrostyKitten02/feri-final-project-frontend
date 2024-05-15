import {RawAxiosRequestConfig} from "axios";


export default class RequestUtil {
    private constructor() {}
    public static createBaseAxiosRequestConfig(session: string): RawAxiosRequestConfig {
        console.log(import.meta.env.VITE_BACKEND_BASE_URL)
        return {
            baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
            headers: {
                Authorization: `Bearer ${session}`,
            },
        };
    }
}