import { AxiosError, RawAxiosRequestConfig } from "axios";
import { Configuration } from "../../temp_ts";
import { toastError } from "../components/toast-modals/ToastFunctions";

export default class RequestUtil {
  private constructor() {}
  public static readonly API_CONFIG: Configuration = new Configuration({
    basePath: import.meta.env.VITE_BACKEND_BASE_URL,
  });

  public static createBaseAxiosRequestConfig(
    session: string | null
  ): RawAxiosRequestConfig {
    if (session == null) {
      return {};
    }

    return {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    };
  }

  public static handleAxiosRequestError(error: unknown) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data.message ||
        error.message ||
        "An unknown error occured.";
      toastError(errorMessage);
    } else {
      toastError("An unexpected error occured.");
    }
  }
}
