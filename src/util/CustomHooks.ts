import { RawAxiosRequestConfig } from "axios";
import RequestUtil from "./RequestUtil";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";

export function useRequestArgs(): {
  getRequestArgs: () => Promise<RawAxiosRequestConfig>;
} {
  const auth = useAuth();
  return {
    getRequestArgs: async () => {
      const session = await auth.getToken();
      return RequestUtil.createBaseAxiosRequestConfig(session);
    },
  };
}

export const useUserImageLoader = () => {
  const [userImageLoaded, setUserImageLoaded] = useState<{
    [key: string]: boolean;
  }>({});

  const updateImageState = (userId?: string) => {
    setUserImageLoaded((prevState) => ({
      ...prevState,
      [userId as string]: true,
    }));
  };

  return { userImageLoaded, updateImageState };
};
