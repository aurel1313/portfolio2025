const isLocalhost = process.env.NODE_ENV === "development";

const BASE_URL = isLocalhost
  ? "http://localhost:5000"
  : "https://portfolio2025back.vercel.app";

  export { BASE_URL };