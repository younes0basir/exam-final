import axios from "axios";
import { getApiBaseUrl, getToken, clearAuth } from "../config.js";

export function createApiClient() {
  const client = axios.create({
    baseURL: `${getApiBaseUrl()}/api`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    timeout: 10000
  });

  client.interceptors.request.use((request) => {
    const token = getToken();
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        clearAuth();
      }
      return Promise.reject(error);
    }
  );

  return client;
}

export function createAuthClient() {
  return axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    timeout: 10000
  });
}
