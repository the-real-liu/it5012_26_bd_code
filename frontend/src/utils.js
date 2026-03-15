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
    let error = new Error(response.statusText);
    error.status = response.status;
    throw error;
  }
  return response;
}
