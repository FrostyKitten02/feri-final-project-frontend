import RequestUtil from "./RequestUtil";
import { ProjectControllerApi, WorkPackageControllerApi,  } from "../../temp_ts";

export const projectAPI = new ProjectControllerApi(RequestUtil.API_CONFIG);
export const workPackageAPI = new WorkPackageControllerApi(RequestUtil.API_CONFIG);
