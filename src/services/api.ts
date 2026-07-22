import axios from "axios";

export const api = axios.create({
  baseURL: "https://localhost:7082/api", // URL da sua API
});
