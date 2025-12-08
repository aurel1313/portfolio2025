import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { Vercel } from "@vercel/sdk";
import path from "path";
import { fileURLToPath } from "url";
import { BASE_URL, FRONT_URL } from "./utils/utils.js";
import nodemailer from 'nodemailer'
import jwt from "jsonwebtoken";
import crypto from "crypto";
// Utiliser require pour les environnements CommonJS (si nécessaire), sinon garder import
// Remplacer les imports par des require est complexe avec le code fourni,
// nous allons conserver la syntaxe ESM (import/export) standard pour Node.js moderne.
import avis from "./avis/avis.js";
import { isDevelopment } from "./utils/utils.js";
 const magicStore = new Map();
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
const apiKey = process.env.API_GEMINI;

if (!apiKey) {
  console.error(
    "ERREUR FATALE: La clé API Gemini n'est pas chargée dans process.env. Vérifiez votre fichier .env et dotenv.config()."
  );
  process.exit(1);
}
const ai = new GoogleGenAI({ apiKey: apiKey });
console.log(`Key loaded: ${!!process.env.API_GEMINI}`);

// Utiliser cors et bodyparser
app.use(cors());
app.use(bodyParser.json());

// --- GESTION DE LA SESSION DE CHAT GLOBALE ---
let chatSession = null;
const LOGIN_SECRET = process.env.LOGIN_SECRET // Le login défini dans le backend
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD // Le mot de passe défini dans le backend

const isEmail = (str) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
};
app.get("/cv", (req, res) => {
  const filePath = path.join(dir, "public", "CVDevFullstackAurelienFabre.pdf");

  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);

      res.status(500).send("Error downloading file");
    }
  });
});
const url = "https://api.vercel.com/v9/projects/taekna";
const options = {
  method: "GET",

  headers: { Authorization: `Bearer ${process.env.VERCEL_API}` },

  body: undefined,
};
app.get("/projetStage", async (req, res) => {
  try {
    const response = await fetch(url, options);

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: error.message });
  }
});
// Fonction pour générer une réponse du modèle
const getModelResponse = async (message) => {
  // Si aucune session n'existe, nous devons la créer pour démarrer le Tour 1
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
  }

  // --- 2. SESSION EXISTANTE (Tour 2 et suivants) ---
  else {
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
      const token = crypto.randomBytes(16).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const tokenExpiry = Date.now() + 3600000; // 1 heure
   // Stockage en mémoire pour l'exemple
      magicStore.set(tokenHash, { email: message.trim(), expires: tokenExpiry });
     const magicLink = `${BASE_URL}/auth/login?token=${token}&email=${encodeURIComponent(message.trim())}`;
       //envoie du mail avec le login// 
        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        from: process.env.EMAIL_USER,
        to: message.trim(),
        subject: 'Votre login pour le projet Taekna',
        //lien magique pour le login et mdp
        html: `<p>Bonjour,</p><p>Cliquez sur le lien suivant pour accéder au projet Taekna : <a href="${magicLink}">Accéder au projet Taekna</a></p><p>Cordialement,<br/>L'équipe Taekna</p>`

      });
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: isEmail(message.trim()) ? message.trim() : '',
        subject: 'Votre login pour le projet Taekna',
        html: `<p>Bonjour,</p><p>Cliquez sur le lien suivant pour accéder au projet Taekna : <a href="${magicLink}">Accéder au projet Taekna</a></p><p>Cordialement,<br/>L'équipe Taekna</p>`
      };
    
      //envoi de l'email
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
      });
    }
    // Retourner la réponse complète, le front-end doit afficher le Tour 2
    return (
      fakeResponse1 + "\n--------------------------\n" + response2Text.trim()
    );
  }
};
app.get("/auth/login", (req, res) => {
  const { token, email } = req.query;
  if (!token || !email) {
    return res.status(400).send("Lien magique invalide.");
  }
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const storedData = magicStore.get(tokenHash);
  if (!storedData || storedData.email !== email || storedData.expires < Date.now()) {
    return res.status(400).send("Lien magique invalide ou expiré.");
  }
  storedData.used = true;
  const jwtToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie("session_token", jwtToken, { httpOnly: true, secure: !isDevelopment, maxAge: 3600000 });

  res.send("Authentification réussie ! Vous pouvez maintenant accéder au projet Taekna.");
});
app.post("/gemini", async (req, res) => {
  try {
    const { message } = req.body; // --- Logique existante du CV ---

    if (message.includes("CV")) {
      // ... (Logique CV inchangée)
      const systemInstructions = ai.chats.create({
        /* ... */
      });
      const result = await systemInstructions.sendMessage({ message: message }); // Retourne un objet link pour le téléchargement
      res.json({ response: result.text, link: `${BASE_URL}/cv` });
    }
    // --- Logique PROJET/LOGIN (Conversation Multi-tours) ---
    else if (message.includes("projet") || chatSession) {
      // Le chat commence avec "projet" OU continue si une session existe
      const projetResponse = await getModelResponse(message);
      res.json({ response: projetResponse });
    } else {
      // Message non pertinent et pas de session active
      res.json({
        response:
          "Je suis désolé, je ne peux répondre qu'aux questions sur mon CV ou le projet Taekna.",
      });
    }
  } catch (error) {
    console.error("Erreur Gemini/Vercel:", error); // Réinitialiser la session en cas d'erreur critique
    chatSession = null;
    res.status(500).json({ error: true, response: error.message });
  }
});

app.use("/avis",avis);
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
