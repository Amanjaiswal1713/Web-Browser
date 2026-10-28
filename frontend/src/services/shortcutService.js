import { apiRequest } from "./api";

export function getShortcuts() {
  return apiRequest("/shortcuts");
}

export function addShortcut(shortcut) {
  return apiRequest("/shortcuts", {
    method: "POST",

    body: JSON.stringify(shortcut),
  });
}

export function deleteShortcut(id) {
  return apiRequest(`/shortcuts/${id}`, {
    method: "DELETE",
  });
}
