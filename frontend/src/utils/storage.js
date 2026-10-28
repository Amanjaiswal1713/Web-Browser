export function getStoredData(key, fallback = []) {
  try {
    const value = window.localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function saveStoredData(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));

    return true;
  } catch {
    return false;
  }
}
