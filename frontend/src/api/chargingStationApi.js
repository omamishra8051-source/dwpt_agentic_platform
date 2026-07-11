import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getChargingStations = async () => {
  const response = await API.get("/charging-stations/");
  return response.data;
};

export const getChargingStation = async (id) => {
  const response = await API.get(`/charging-stations/${id}`);
  return response.data;
};

export const addChargingStation = async (station) => {
  const response = await API.post("/charging-stations/", station);
  return response.data;
};

export const updateChargingStation = async (id, station) => {
  const response = await API.put(`/charging-stations/${id}`, station);
  return response.data;
};

export const deleteChargingStation = async (id) => {
  const response = await API.delete(`/charging-stations/${id}`);
  return response.data;
};

export default API;