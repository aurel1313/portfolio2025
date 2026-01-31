import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import { Vercel } from "@vercel/sdk";
import path from "path";
import { fileURLToPath } from "url";
import { BASE_URL, FRONT_URL } from "./utils/utils.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import crypto from "crypto";
// Utiliser require pour les environnements CommonJS (si nécessaire), sinon garder import
// Remplacer les imports par des require est complexe avec le code fourni,
// nous allons conserver la syntaxe ESM (import/export) standard pour Node.js moderne.
import avis from "./avis/avis.js";
import contact from "./contact/contact.js";
import { isDevelopment } from "./utils/utils.js";
import { genererCV, responseGeminiProjet,monProfil } from "./services/gemini/gemini.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// Utiliser cors et bodyparser
app.use(cors());
app.use(bodyParser.json());

// --- GESTION DE LA SESSION DE CHAT GLOBALE ---
let chatSession = null;

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
  try {
    const responseGemini = await responseGeminiProjet(chatSession, message);
  } catch (error) {
    console.error("Erreur dans getModelResponse:", error);
    chatSession = null;
    throw error;
  }
};
app.get("/auth/login", (req, res) => {
  const { token, email } = req.query;
  if (!token || !email) {
    return res.status(400).send("Lien magique invalide.");
  }
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const storedData = magicStore.get(tokenHash);
  if (
    !storedData ||
    storedData.email !== email ||
    storedData.expires < Date.now()
  ) {
    return res.status(400).send("Lien magique invalide ou expiré.");
  }
  storedData.used = true;
  const jwtToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.cookie("session_token", jwtToken, {
    httpOnly: true,
    secure: !isDevelopment,
    maxAge: 3600000,
  });

  res.send(
    "Authentification réussie ! Vous pouvez maintenant accéder au projet Taekna.",
  );
});
app.post("/gemini", async (req, res) => {
  try {
    //enum items as hard skills, soft skills, parcours, expérience, compétences
    const enums = [
      "hard skills",
      "soft skills",
      "parcours",
      "experience",
      "expériences",
      "expérience",
      "compétences"
    ];
    const { message } = req.body; // --- Logique existante du CV ---
    //const remainRequestsValue=await remainRequests();
    if (message.includes("cv")) {
      // ... (Logique CV inchangée)
      const CV = genererCV(message);
      const result = await CV;
      res.json({
        response: result.text,
        link: `${BASE_URL}/CVDevFullstackAurelienFabre.pdf`,
        
      });
    }else if(enums.some(enumItem => message.includes(enumItem))){
      const profil = monProfil(message);
      const result = await profil;
      res.json({
        response: result.text,
        
      });
    }
    // --- Logique PROJET/LOGIN (Conversation Multi-tours) ---
    else if (message.includes("projet") || chatSession) {
      // Le chat commence avec "projet" OU continue si une session existe
      const projetResponse = await getModelResponse(message);
      res.json({ response: projetResponse  });
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

app.use("/avis", avis);
app.use("/contact", contact);
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
