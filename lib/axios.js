import axios from "axios";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig()

export const axiosInstance = axios.create({
  baseURL: publicRuntimeConfig.baseURL
})