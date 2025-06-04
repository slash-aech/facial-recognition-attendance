import axios from "axios";

const BASE_URL = "http://localhost:5000";

export async function fetchUserById(uniqueId) {
  if (!uniqueId) throw new Error("Unique ID required");
  const response = await axios.get(`${BASE_URL}/user/${uniqueId}`);
  return response.data;
}
