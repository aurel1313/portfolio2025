import { sendEmail } from "../mail/mail.js";
import { GoogleGenAI } from "@google/genai";
const apiKey = process.env.API_GEMINI;
const ai = new GoogleGenAI({ apiKey: apiKey });
const responseGeminiProjet = async (chatSession, message) => {
  const magicStore = new Map();
  if (!apiKey) {
    console.error(
      "ERREUR FATALE: La clé API Gemini n'est pas chargée dans process.env. Vérifiez votre fichier .env et dotenv.config().",
    );
    process.exit(1);
  }

  try {
    if (!chatSession) {
      // --- 1. INITIALISATION DE LA SESSION (Tour 1) ---
      const systemPrompt = `
Tu es un assistant qui aide les utilisateurs à obtenir le login de connexion pour le projet Taekna hébergé sur Vercel.
Lorsque l'utilisateur demande le login du projet Taekna, tu dois lui demander son adresse e-mail pour des raisons de sécurité.
Si l'utilisateur fournit une adresse e-mail valide, tu lui donnes envoie un mail avec le login suivant ${LOGIN_SECRET}.
Si l'utilisateur ne fournit pas une adresse e-mail valide, tu lui demandes de fournir une adresse e-mail correcte.
Ne donne jamais le login sans avoir validé une adresse e-mail correcte.
`;

      chatSession = ai.chats.create({
        model: "gemini-2.5-flash",
        history: [{ role: "model", parts: [{ text: systemPrompt }] }],
      });

      // Simuler le premier message de l'utilisateur pour obtenir la demande d'e-mail
      const initialQuery = "Peux-tu me donner le login du projet Taekna ?";
      const stream1 = await chatSession.sendMessageStream({
        message: initialQuery,
      });
      let response1Text = "";
      for await (const chunk of stream1) {
        response1Text += chunk.text;
      }

      // FAKER la réponse du Tour 2 pour satisfaire la logique de parsing du front-end
      const fakeResponse2 = "[Tour 2] (En attente d'e-mail)";
      //si email dans le message

      // Retourner la réponse complète, le front-end doit afficher le Tour 1
      return (
        response1Text.trim() + "\n--------------------------\n" + fakeResponse2
      );
    } else {
      // L'utilisateur a déjà initié la conversation. On utilise le message qu'il vient d'envoyer.

      // Exécuter le message de l'utilisateur sur la session existante
      const stream2 = await chatSession.sendMessageStream({ message });
      let response2Text = "";
      for await (const chunk of stream2) {
        response2Text += chunk.text;
      }

      // FAKER la réponse du Tour 1 pour satisfaire la logique de parsing du front-end
      const fakeResponse1 = "[Tour 1] (Déjà affiché)";

      //si email dans le message
      if (isEmail(message.trim())) {
        const token = crypto.randomBytes(16).toString("hex");
        const tokenHash = crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");
        const tokenExpiry = Date.now() + 3600000; // 1 heure
        // Stockage en mémoire pour l'exemple
        magicStore.set(tokenHash, {
          email: message.trim(),
          expires: tokenExpiry,
        });
        const magicLink = `${BASE_URL}/auth/login?token=${token}&email=${encodeURIComponent(
          message.trim(),
        )}`;

        await sendEmail(
          message.trim(),
          "Votre login pour le projet Taekna",
          `<p>Bonjour,</p><p>Cliquez sur le lien suivant pour accéder au projet Taekna : <a href="${magicLink}">Accéder au projet Taekna</a></p><p>Cordialement,<br/>L'équipe Taekna</p>`,
        );
      }
      // Retourner la réponse complète, le front-end doit afficher le Tour 2
      return (
        fakeResponse1 + "\n--------------------------\n" + response2Text.trim()
      );
    }
  } catch (error) {
    console.error("Erreur lors de la requête à Gemini :", error);
    throw error;
  }
};
const genererCV = async (message) => {
  const systemInstructions = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [
      {
        role: "model",
        parts: [
          {
            text: `Tu es un assistant qui aide les utilisateurs à obtenir le CV d'Aurélien Fabre, développeur fullstack.
Lorsque l'utilisateur demande le CV, tu dois lui fournir un lien de téléchargement direct vers le CV hébergé sur le serveur.`,
          },
        ],
      },
    ],
  });
  const result = await systemInstructions.sendMessage({ message: message }); // Retourne un objet link pour le téléchargement
  return result;
};
const monProfil = async (message) => {
  const systemInstructions = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [
      {
        role: "model",
        parts: [
          {
            text: `Tu es un assistant qui aide les utilisateurs à obtenir des informations sur le profil d'Aurélien Fabre, développeur fullstack.
Lorsque l'utilisateur demande des informations sur le profil, tu dois lui fournir une description détaillée du profil d'Aurélien Fabre. Si le
utilisateur pose des questions spécifiques, réponds-y de manière précise.Par
exemple sur les soft skills, hard skills, expériences, formations, projets, etc.
Ne pas indiquer en soft skills la partie communication,mais dire le travail en equipe,adaptabilité,resolution de problèmes.
les experiences sont:
Expériences Professionnelles
06/2025 –
09/2025
Développeur Full Stack & Mobile, CDOS (Comité Olympique), Niort
Projet : Conception de A à Z d’une plateforme de gestion pour ligues et clubs sportifs.
Développement d’une application mobile cross-plateforme en React Native.
Création d’une API Backend performante avec Node.js pour centraliser les données.
Mise en place de l’architecture technique et rédaction de la documentation.
10/2022 –
09/2024
Alternant Développeur Full Stack, MonLook, Niort
Contexte : E-commerce / Retail (Prêt-à-porter).
Développement et maintenance d’un ERP interne de gestion de stocks (PHP/JS).
Optimisation des flux logistiques et automatisation des processus d’inventaire.
Application des bonnes pratiques : tests, revues de code et intégration continue.
Travail en autonomie sur l’analyse des besoins et la résolution d’incidents critiques.
09/2021 –
08/2022
Alternant Développeur Frontend, Digital Associates, Niort
Refonte de l’interface utilisateur (UI/UX) d’un outil de gestion budgétaire.
Intégration de maquettes responsive et collaboration avec les équipes Design.
01/2021 –
02/2021
Stage Développeur Web, Lycée Saint-Joseph, Bressuire
Développement d’une application de recherche géographique avec le framework CodeIgniter.
.`,
          },
        ],
      },
    ],
  });
  const result = await systemInstructions.sendMessage({ message: message });
  return result;
};

/*const remainRequests = async () => {
  try {
   const model = ai.
    return quota.remainingRequests;
  } catch (error) {
    console.error("Erreur lors de la récupération du quota Gemini :", error);
    throw error;
  }
};*/
export { responseGeminiProjet, genererCV, monProfil };
