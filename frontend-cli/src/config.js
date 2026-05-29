import Conf from "conf";
import dotenv from "dotenv";

dotenv.config();

export const config = new Conf({
  projectName: "upf-cli",
  defaults: {
    apiBaseUrl: process.env.API_BASE_URL || "http://13.49.72.180",
    token: null,
    user: null
  }
});

export function getApiBaseUrl() {
  return config.get("apiBaseUrl");
}

export function setApiBaseUrl(url) {
  config.set("apiBaseUrl", url);
}

export function getToken() {
  return config.get("token");
}

export function setAuth(token, user) {
  config.set("token", token);
  config.set("user", user ?? null);
}

export function clearAuth() {
  config.set("token", null);
  config.set("user", null);
}

export function getUser() {
  return config.get("user");
}
