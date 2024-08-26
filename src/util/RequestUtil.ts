import {RawAxiosRequestConfig} from "axios";
import {Configuration} from "../../temp_ts";


export default class RequestUtil {
    private constructor() {}
    public static readonly API_CONFIG: Configuration = new Configuration({
        basePath: import.meta.env.VITE_BACKEND_BASE_URL
    });

    public static createBaseAxiosRequestConfig(session: string | null): RawAxiosRequestConfig {
        if (session == null) {
            return {};
        }

        return {
            headers: {
                Authorization: `Bearer ${session}`,
            },
        };
    }

}