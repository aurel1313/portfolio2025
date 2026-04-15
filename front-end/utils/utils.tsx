// localhost ou production en fonction de l'environnement



/*const isLocalhost = process.env.NODE_ENV === "development";

const BASE_URL = isLocalhost
  ? "http://localhost:5000"
  : "https://portfolio2025back.vercel.app";

  export { BASE_URL };*/
  import Constants from "expo-constants";
  import { Platform } from "react-native";

  const getDevUrl = ()=>{
    // Récupère l'URI de l'hôte Expo (disponible uniquement en développement)
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    // Extraire l'adresse IP de l'hôte
    const ipAddress = hostUri.split(":")[0];
    return `http://${ipAddress}:5000`;
  }
   return Platform.OS === "android"
    ? "http://10.0.2.2:5000" 
    : "http://localhost:5000";
  }
  const BASE_URL = __DEV__ ? getDevUrl() : "https://portfolio2025back.vercel.app";

  export { BASE_URL };