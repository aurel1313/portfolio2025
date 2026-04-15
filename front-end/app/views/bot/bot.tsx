import { View, Text, Button } from "react-native";
import { TextInput } from "react-native";
import { GoogleGenAI } from "@google/genai";
import { useState } from "react";
import { BASE_URL } from "@/utils/utils";
import { useContext } from "react";
import { useThemeTransition } from "@/app/Context/Theme/ThemeTransition";
export default function BotScreen() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [errorResponse, setErrorResponse] = useState(""); // État pour bloquer l'interface pendant l'appel
  const [isLoading, setIsLoading] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState<number | null>(
    null,
  );
  console.log("BASE_URL utilisé pour le bot:", BASE_URL);
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
      // --- GESTION DES ERREURS DU SERVEUR ---

      if (data.error && data.response) {
        try {
          // ÉTAPE 1 : On parse la première couche (le champ 'response')
          let parsedData = JSON.parse(data.response);
          //setRemainingRequests(data.remainingRequests || null);
          // ÉTAPE 2 : On regarde si 'message' à l'intérieur est aussi une string JSON
          if (
            parsedData.error &&
            parsedData.error.message &&
            typeof parsedData.error.message === "string"
          ) {
            try {
              // On tente de parser le message interne (celui avec les \n et \")
              const innerMessage = JSON.parse(parsedData.error.message);

              // On remplace la string illisible par l'objet propre
              parsedData.error.message = innerMessage;
            } catch (e) {
              // Si ce n'est pas du JSON, on garde le message tel quel
              console.log(
                "Le message n'était pas du JSON, on le garde tel quel.",
              );
            }
          }

          //afficher l'erreur proprement
          setErrorResponse(
            `Erreur du serveur : ${parsedData.error.message.error.message}`,
          );
          if (
            parsedData.error.message &&
            parsedData.error.message.error.code === 429
          ) {
            //using setResponse to give user a friendly message
            setErrorResponse(
              "Vous avez dépassé votre quota actuel, veuillez reessayer plus tard.",
            );
          }
        } catch (err) {
          // Fallback : si le parsing échoue, on affiche ce qu'on a reçu brut
          let fallbackMessage = JSON.stringify(data);
         console.log(fallbackMessage, "est le message brut reçu du serveur");
          //setErrorResponse(`Erreur du serveur (format inattendu) : ${fallbackMessage.}`); // Affiche le message brut reçu du serveur
        }

        return;
      }

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
        currentMessage.includes("cv") ||
        (currentMessage.includes("projet") &&
          responseToDisplay.includes("Tour 1") &&
          responseToDisplay.includes("Tour 2"))
      ) {
        setMessage(""); // Clear the input field after initial question
        // C'est le premier tour (question initiale). On affiche le Tour 1.
        const tour1Response = responseToDisplay.split(
          "--------------------------",
        )[0];
        responseToDisplay = tour1Response.trim();
        console;
      } else if (
        currentMessage.includes("@") &&
        responseToDisplay.includes("Tour 2")
      ) {
        setMessage(""); // Clear the input field after email submission
        // C'est le deuxième tour (soumission de l'e-mail). On affiche le Tour 2.
        const tour2Response = responseToDisplay.split(
          "--------------------------",
        )[1];
        responseToDisplay = tour2Response.trim();
      } // Si aucune condition n'est remplie (ex: simple follow-up ou message non pertinent),
      // on affiche la réponse brute (elle sera le Tour 2 ou un message par défaut).
      //les tours suivants peuvent être gérés ici si nécessaire

      if (data.response) {
        setMessage(""); // Effacer le champ de saisie après l'envoi
        setResponse(data.response);
      }
    } catch (error) {
      setErrorResponse(`Erreur de connexion : ${error}`);
    } finally {
      setIsLoading(false); // Débloquer l'interface
    }
  };
  // Context pour le displayedTheme
  const { displayedTheme } = useThemeTransition();

  return (
    <View
      className={`flex flex-col border mx-auto md:w-1/2 relative z-40 ${displayedTheme === "dark" ? "bg-gray-900" : "bg-white"} min-h-auto items-center justify-start pt-20 pb-10 rounded-xl shadow-lg`}
    >
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
      {/*remainingRequests !== null && (
        <Text className="text-sm text-gray-500 mt-2">
          Requêtes restantes aujourd'hui: {remainingRequests}
        </Text>
      )*/}
      <View
        className={`m-4 p-4 w-3/4 border border-gray-300 rounded-lg bg-gray-50 min-h-[100px] mt-8 shadow-inner ${displayedTheme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
      >
        <Text className="font-semibold text-gray-800 mb-2">Réponse:</Text>

        {isLoading ? (
          <Text
            className={`text-indigo-500 animate-pulse ${displayedTheme === "dark" ? "text-indigo-400" : ""}`}
          >
            Chargement...
          </Text>
        ) : (
          <Text
            className={`text-gray-700 whitespace-pre-wrap ${displayedTheme === "dark" ? "text-white" : ""}`}
          >
            {response || "En attente de votre question..."}
          </Text>
        )}
      </View>

      {errorResponse ? (
        <View className="m-4 p-4 w-3/4 border border-red-400 rounded-lg bg-red-50 min-h-[100px] mt-4 shadow-inner">
          <Text className="font-semibold text-red-800 mb-2">Erreur:</Text>
          <Text className="text-red-700 whitespace-pre-wrap">
            {errorResponse}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
