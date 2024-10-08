import RequestUtil from "./RequestUtil";
import {
    OccupancyControllerApi,
    PersonControllerApi,
    PersonTypeControllerApi,
    ProjectBudgetSchemaControllerApi,
    ProjectControllerApi,
    SalaryControllerApi,
    TaskControllerApi,
    WorkPackageControllerApi,
} from "../../client";

export const projectAPI = new ProjectControllerApi(RequestUtil.API_CONFIG);
export const workPackageAPI = new WorkPackageControllerApi(RequestUtil.API_CONFIG);
export const personTypeAPI = new PersonTypeControllerApi(RequestUtil.API_CONFIG);
export const personAPI = new PersonControllerApi(RequestUtil.API_CONFIG);
export const taskAPI = new TaskControllerApi(RequestUtil.API_CONFIG);
export const projectSchemaAPI = new ProjectBudgetSchemaControllerApi(RequestUtil.API_CONFIG);
export const salaryApi = new SalaryControllerApi(RequestUtil.API_CONFIG);
export const occupancyAPI = new OccupancyControllerApi(RequestUtil.API_CONFIG);
