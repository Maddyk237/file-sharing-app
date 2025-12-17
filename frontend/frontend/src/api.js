// const BASE_URL = "http://localhost:5000/api";
const BASE_URL = "https://file-sharing-backend.onrender.com/api";

export const api = async (url, method = "GET", body, isFormData = false) => {
  const token = localStorage.getItem("token");

  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(BASE_URL + url, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : null,
  });

  return res.json();
};
