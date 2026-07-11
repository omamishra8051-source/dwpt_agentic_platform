import API from "./vehicleApi";

export const runAgentPipeline = async (vehicleId) => {
  const response = await API.post(`/agents/run/${vehicleId}`);
  return response.data;
};