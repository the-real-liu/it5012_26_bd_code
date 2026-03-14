import { handleError, getCookie } from './utils';

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

    const response = handleError(await fetch(request));
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
      const token = localStorage.getItem("token");
      const request = new Request('/api/my_role', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
          "X-CSRFToken": getCookie("csrftoken")
        },
      });
      const response = handleError(await fetch(request));
      const data = await response.json();
      return data.role;
  },
};
