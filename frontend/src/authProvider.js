import { handleError, getCookie } from "./utils";

export const authProvider = {
  login: async ({ email, password }) => {
    const request = new Request("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
    });

    const response = handleError(await fetch(request));
    const data = await response.json();
    localStorage.setItem("token", data.key);
  },

  logout: async () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },

  checkAuth: () => {
    return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
  },

  checkError: (error) => {
    console.log(error)
    console.log(error.status)
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem("token");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: async () => {
    const token = localStorage.getItem("token");
    const request = new Request("/api/my_role", {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
    });
    const response = await fetch(request);
    if (!response.ok && (response.status == 401 || response.status == 403)) {
      return "";
    }
    const data = await response.json();
    return data.role;
  },
};
