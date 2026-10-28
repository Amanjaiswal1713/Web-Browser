import { apiRequest } from "./api";

export function register(name, email, password) {
  return apiRequest("/auth/register", {
    method: "POST",

    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
}

export function login(email, password) {
  return apiRequest("/auth/login", {
    method: "POST",

    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export function saveAuth(data) {
  localStorage.setItem("safora-auth-token", data.token);

  localStorage.setItem(
    "safora-user",
    JSON.stringify({
      id: data.userId,

      name: data.name,

      email: data.email,
    }),
  );
}

export function getStoredUser() {
  const stored = localStorage.getItem("safora-user");

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function getStoredToken() {
  return localStorage.getItem("safora-auth-token");
}

export function logout() {
  localStorage.removeItem("safora-auth-token");

  localStorage.removeItem("safora-user");
}
