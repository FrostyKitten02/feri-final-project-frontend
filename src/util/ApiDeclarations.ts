import RequestUtil from "./RequestUtil";
import { PersonTypeControllerApi, ProjectControllerApi, WorkPackageControllerApi,  } from "../../temp_ts";

export const projectAPI = new ProjectControllerApi(RequestUtil.API_CONFIG);
export const workPackageAPI = new WorkPackageControllerApi(RequestUtil.API_CONFIG);
export const personTypeAPI = new PersonTypeControllerApi(RequestUtil.API_CONFIG);
