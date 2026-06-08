declare const process: { env: { NODE_ENV?: string } };

const isLocalhost = process.env.NODE_ENV === "development";
const isDevelopment = process.env.NODE_ENV === "development";
const BASE_URL = isLocalhost
  ? "http://localhost:5000"
  : "https://portfolio2025back.vercel.app";
const FRONT_URL = isLocalhost
  ? "http://localhost:8081"
  : "https://portfolio2025af.vercel.app";
     const isEmail = (text: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(text);
      };
  export { BASE_URL,isDevelopment,FRONT_URL,isEmail };