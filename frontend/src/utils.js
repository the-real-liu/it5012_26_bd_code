export function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + "=")) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

export function handleError(response) {
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response;
}
