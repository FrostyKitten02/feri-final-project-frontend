export default class Paths {

    public static readonly HOME = "/";

    public static readonly SIGN_UP = "/sign-up";
    public static readonly SIGN_IN = "/sign-in";
    public static readonly INTRODUCTION = "/introduction";

    public static readonly PROJECTS = "/projects";
    public static readonly DASHBOARD = "/dashboard";

    public static readonly PROJECT = "/project/:projectId"
    public static readonly TEAM = Paths.PROJECT + "/team"
    public static readonly WORK_PACKAGES = Paths.PROJECT + "/work-packages"
    public static readonly PROJECT_DASHBOARD = Paths.PROJECT + "/project-dashboard"
    public static readonly PROJECT_OVERVIEW = Paths.PROJECT + "/overview"
    public static readonly WORKLOAD =  Paths.PROJECT + "/workload";
    public static readonly FILE_MANAGER = Paths.PROJECT + "/file-manager"
}