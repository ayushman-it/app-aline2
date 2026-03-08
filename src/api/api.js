import axios from "axios";

export const API = axios.create({
  baseURL: "http://172.20.10.3:5000/api",
  timeout: 10000,
});