const SEARCH_ENGINES = {
  google: "https://www.google.com/search?q=",
  bing: "https://www.bing.com/search?q=",
  duckduckgo: "https://duckduckgo.com/?q=",
};
const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);
function validateExternalUrl(value) {
  try {
    const parsedUrl = new URL(value);
    if (!ALLOWED_PROTOCOLS.has(parsedUrl.protocol)) {
      return null;
    }
    return parsedUrl.toString();
  } catch {
    return null;
  }
}
function looksLikeLocalhost(value) {
  return /^(localhost|127\.0\.0\.1)(:\d+)?(?:[/?#].*)?$/i.test(value);
}
function looksLikeIPv4(value) {
  const match = value.match(
    /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?::\d+)?(?:[/?#].*)?$/,
  );
  if (!match) {
    return false;
  }
  return match
    .slice(1, 5)
    .every((part) => Number(part) >= 0 && Number(part) <= 255);
}
function looksLikeDomain(value) {
  return /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}(?::\d+)?(?:[/?#].*)?$/i.test(
    value,
  );
}
function resolveNavigationInput(input, searchEngine = "bing") {
  const value = typeof input === "string" ? input.trim() : "";

  if (!value) {
    return null;
  }
  const engineUrl = SEARCH_ENGINES[searchEngine] ?? SEARCH_ENGINES.bing;
  if (/^[a-z][a-z\d+.-]*:/i.test(value)) {
    return validateExternalUrl(value);
  }
  if (looksLikeLocalhost(value) || looksLikeIPv4(value)) {
    return validateExternalUrl(`http://${value}`);
  }
  if (looksLikeDomain(value)) {
    return validateExternalUrl(`https://${value}`);
  }
  return engineUrl + encodeURIComponent(value);
}
module.exports = {
  SEARCH_ENGINES,
  resolveNavigationInput,
  validateExternalUrl,
};
