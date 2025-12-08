const isLocalhost = process.env.NODE_ENV === "development";
const isDevelopment = process.env.NODE_ENV === "development";
const BASE_URL = isLocalhost
  ? "http://localhost:5000"
  : "https://portfolio2025back.vercel.app";
const FRONT_URL = isLocalhost
  ? "http://localhost:8081"
  : "https://portfolio2025af.vercel.app";
  export { BASE_URL,isDevelopment,FRONT_URL };