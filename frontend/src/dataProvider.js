import { handleError, getCookie } from "./utils";

const API_URL = "/api";

const resourceMap = {
  students: "admin/management/students",
  courses: "admin/management/courses",
  subjects: "admin/management/subjects",
  lecturers: "admin/management/lecturers",

  admin_reset_password: "admin/reset_password",

  lecturer_courses: "lecturer/courses",
  lecturer_coursegrades: "lecturer/coursegrades",

  student_enrolment: "student/enrolment",
  student_grades: "student/grades",
};

const singletonMap = {
  admin_dashboard: "admin/dashboard",
  lecturer_dashboard: "lecturer/dashboard",
  student_dashboard: "student/dashboard",
  student_progress: "student/progress",
};

function normalizeRecord(record) {
  if (record.id) return record;

  const idKey = Object.keys(record).find((k) => k.endsWith("_id"));

  return {
    ...record,
    id: record[idKey],
  };
}

export const dataProvider = {
  getList: async (resource) => {
    const token = localStorage.getItem("token");

    const response = handleError(await fetch(`${API_URL}/${resourceMap[resource]}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    }));

    const data = await response.json();
    const records = data.results || data;

    return {
      data: records.map(normalizeRecord),
      total: data.length,
    };
  },

  getOne: async (resource, params) => {
    const token = localStorage.getItem("token");

    if (resource == "admin_reset_password") {
      return { data: { id: params["id"] } };
    }

    var url = "";
    if (params["id"] == "singleton") {
      url = `${API_URL}/${singletonMap[resource]}`;
    } else {
      url = `${API_URL}/${resourceMap[resource]}/${params["id"]}`;
    }

    const response = handleError(await fetch(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
    }));

    const data = await response.json();
    const record = data.results || data;

    if (params["id"] == "singleton") {
      return { data: { ...record, id: "singleton" } };
    }
    return { data: normalizeRecord(record) };
  },

  create: async (resource, params) => {
    const token = localStorage.getItem("token");

    const response = handleError(await fetch(`${API_URL}/${resourceMap[resource]}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(params.data),
    }));

    const data = await response.json();
    const record = data.results || data;

    return { data: normalizeRecord(record) };
  },

  update: async (resource, params) => {
    const token = localStorage.getItem("token");

    const response = handleError(await fetch(
      `${API_URL}/${resourceMap[resource]}/${params["id"]}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify(params.data),
      },
    ));

    const data = await response.json();
    const record = data.results || data;

    return { data: normalizeRecord(record) };
  },

  delete: async (resource, params) => {
    const token = localStorage.getItem("token");

    const response = handleError(await fetch(
      `${API_URL}/${resourceMap[resource]}/${params["id"]}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
          "X-CSRFToken": getCookie("csrftoken"),
        },
      },
    ));

    const data = await response.json();
    const record = data.results || data;

    return { data: normalizeRecord(record) };
  },

  getMany: async (resource, params) => {
    const data = await Promise.all(
      params.ids.map((id) =>
        dataProvider.getOne(resource, { id }).then((data) => data["data"]),
      ),
    );
    return { data };
  },
};
