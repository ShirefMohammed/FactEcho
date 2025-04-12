import axios from "axios";

const SERVER_URL = process.env.NEXT_PUBLIC_CLIENT_URL;

export const axiosPrivate = axios.create({
  baseURL: `${SERVER_URL}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default axios.create({
  baseURL: `${SERVER_URL}/api`,
});
