import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getVehicles = async () => {
  const response = await API.get("/vehicles/");
  return response.data;
};

export const getVehicleStatuses = async () => {
  const response = await API.get("/vehicles/status/all");
  return response.data;
};

export const getVehicle = async (id) => {
  const response = await API.get(`/vehicles/${id}`);
  return response.data;
};

export const addVehicle = async (vehicle) => {
  const response = await API.post("/vehicles/", vehicle);
  return response.data;
};

export const updateVehicle = async (id, vehicle) => {
  const response = await API.put(`/vehicles/${id}`, vehicle);
  return response.data;
};

export const deleteVehicle = async (id) => {
  const response = await API.delete(`/vehicles/${id}`);
  return response.data;
};

export const assignVehicle = async (id, assignment) => {
  const response = await API.post(`/vehicles/${id}/assign`, assignment);
  return response.data;
};

export const getRecommendation = async (id, targetSoc) => {
  const response = await API.post(`/vehicles/${id}/recommendation`, {
    target_soc: targetSoc,
  });
  return response.data;
};

export default API;