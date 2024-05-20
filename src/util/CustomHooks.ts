import { useCookies } from "react-cookie";
import { RawAxiosRequestConfig } from "axios";
import RequestUtil from "./RequestUtil";

export function useRequestArgs(): RawAxiosRequestConfig {
    const [cookies] = useCookies(["__session"]);
    return RequestUtil.createBaseAxiosRequestConfig(cookies.__session);
}