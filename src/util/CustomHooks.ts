import {RawAxiosRequestConfig} from "axios";
import RequestUtil from "./RequestUtil";
import {useAuth} from "@clerk/clerk-react";

export function useRequestArgs(): {
    getRequestArgs : () => Promise<RawAxiosRequestConfig>
} {
    const auth = useAuth();
    return {
        getRequestArgs: async () => {
            const session = await auth.getToken();
            return RequestUtil.createBaseAxiosRequestConfig(session);
        }
    }
}