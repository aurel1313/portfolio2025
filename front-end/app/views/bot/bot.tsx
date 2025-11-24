import { View, Text, Button } from "react-native";
import { TextInput } from "react-native";
import { GoogleGenAI } from "@google/genai";
import { useState } from "react";
import { BASE_URL } from "@/utils/utils";
export default function BotScreen() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [errorResponse, setErrorResponse] = useState(""); // État pour bloquer l'interface pendant l'appel
  const [isLoading, setIsLoading] = useState(false);

  const botFunction = async () => {
    // Réinitialiser les états et bloquer l'interface
    setResponse("");
    setErrorResponse("");
    setIsLoading(true);
    const currentMessage = message.toLowerCase(); // Utiliser une variable locale en minuscules
    try {
      const res = await fetch(`${BASE_URL}/gemini`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }, // Envoyer le message de l'utilisateur
        body: JSON.stringify({ message: currentMessage }),
      });

      const data = await res.json();
      console.log("Réponse du serveur:", data); // --- GESTION DES ERREURS DU SERVEUR ---

      if (data.error) {
        setErrorResponse(
          data.response || "Une erreur inconnue est survenue côté serveur."
        );
        setResponse(""); // Assurez-vous qu'il n'y a pas de réponse normale affichée
        return;
      } // --- GESTION DU TÉLÉCHARGEMENT CV (Adapté pour le DOM) ---

      if (data.link) {
        // Cette logique utilise les APIs du DOM (navigateur) pour le téléchargement.
        const link = document.createElement("a");
        link.href = data.link; // Utiliser data.link directement
        link.download = "CVDevFullstackAurelienFabre.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setResponse("Le téléchargement de votre CV a démarré.");
        return;
      } // --- LOGIQUE DE PARSING MULTI-TOURS (VOTRE CODE) ---

      let responseToDisplay = data.response; // Réponse brute du serveur

      if (
        currentMessage.includes("projet") &&
        responseToDisplay.includes("Tour 1") &&
        responseToDisplay.includes("Tour 2")
      ) {
        // C'est le premier tour (question initiale). On affiche le Tour 1.
        const tour1Response = responseToDisplay.split(
          "--------------------------"
        )[0];
        responseToDisplay = tour1Response.trim();
      } else if (
        currentMessage.includes("@") &&
        responseToDisplay.includes("Tour 2")
      ) {
        // C'est le deuxième tour (soumission de l'e-mail). On affiche le Tour 2.
        const tour2Response = responseToDisplay.split(
          "--------------------------"
        )[1];
        responseToDisplay = tour2Response.trim();
      } // Si aucune condition n'est remplie (ex: simple follow-up ou message non pertinent),
      // on affiche la réponse brute (elle sera le Tour 2 ou un message par défaut).
      //les tours suivants peuvent être gérés ici si nécessaire

      if (data.response) {
        setResponse(data.response);
      }
    } catch (error) {
      console.error("Erreur lors de la requête API:", error);
      //setErrorResponse(`Erreur de connexion : ${error.message}`);
    } finally {
      setIsLoading(false); // Débloquer l'interface
    }
  };

  return (
    <View className="flex flex-col border mx-auto w-1/2 relative z-40 bg-white min-h-auto items-center justify-start pt-20 pb-10 rounded-xl shadow-lg">

      <Text className="font-bold text-2xl text-indigo-700 mb-4">
        Assistant IA
      </Text>

      <Text className="m-4 p-2 w-3/4 text-center text-gray-600">
        Posez une question au bot concernant mon profil ou mes projets.
      </Text>

      <TextInput
        className="border border-gray-300 rounded-lg p-3 m-4 w-3/4 focus:border-indigo-500 transition duration-150"
        placeholder="Type a message..."
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />

      <Button
        onPress={botFunction}
        disabled={isLoading || message.trim() === ""}
        title={isLoading ? "Envoi en cours..." : "Send"}
      />

      <View className="m-4 p-4 w-3/4 border border-gray-300 rounded-lg bg-gray-50 min-h-[100px] mt-8 shadow-inner">

        <Text className="font-semibold text-gray-800 mb-2">
          Réponse:
        </Text>

        {isLoading ? (
          <Text className="text-indigo-500 animate-pulse">
            Chargement...
          </Text>
        ) : (
          <Text className="text-gray-700 whitespace-pre-wrap">
            {response || "En attente de votre question..."}
          </Text>
        )}

      </View>

      {errorResponse ? (
        <Text className="m-4 p-2 w-3/4 border border-red-400 rounded-md text-red-700 bg-red-50">
          Erreur: {errorResponse}
        </Text>
      ) : null}

    </View>
  );
}
