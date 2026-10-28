import { apiRequest } from "./api";

export function getBookmarks() {
  return apiRequest("/bookmarks");
}

export function addBookmark(bookmark) {
  return apiRequest("/bookmarks", {
    method: "POST",

    body: JSON.stringify(bookmark),
  });
}

export function deleteBookmark(id) {
  return apiRequest(`/bookmarks/${id}`, {
    method: "DELETE",
  });
}
