import { axiosInstance } from "./axios";

export const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);
export const authFetcher = (url, token) =>
  axiosInstance
    .get(url, {
      headers: { authorization: token },
    })
    .then((res) => res.data);
