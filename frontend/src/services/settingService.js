import { apiRequest } from "./api";

export function getSettings() {
  return apiRequest("/settings");
}

export function saveSettings(settings) {
  return apiRequest("/settings", {
    method: "PUT",

    body: JSON.stringify(settings),
  });
}
