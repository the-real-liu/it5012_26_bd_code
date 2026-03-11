function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + '=')) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

export const authProvider = {
  login: async ({ username, password }) => {
    const request = new Request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json',
        "X-CSRFToken": getCookie("csrftoken")
      },
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();

    localStorage.setItem('token', data.key);
  },

  logout: async () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },

  checkAuth: () => {
    return localStorage.getItem('token')
      ? Promise.resolve()
      : Promise.reject();
  },

  checkError: (error) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem('token');
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: async () => {
      const response = await fetch("/api/my_role");
      const data = await response.json();
      if (!response.ok) {
        return "unknown";
      }
      return data.role;
  },
};
