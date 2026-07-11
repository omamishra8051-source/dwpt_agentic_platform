import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getHighways = async () => {
  const response = await API.get("/highways/");
  return response.data;
};

export const getHighway = async (id) => {
  const response = await API.get(`/highways/${id}`);
  return response.data;
};

export const addHighway = async (highway) => {
  const response = await API.post("/highways/", highway);
  return response.data;
};

export const updateHighway = async (id, highway) => {
  const response = await API.put(`/highways/${id}`, highway);
  return response.data;
};

export const deleteHighway = async (id) => {
  const response = await API.delete(`/highways/${id}`);
  return response.data;
};

export default API;