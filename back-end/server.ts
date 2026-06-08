import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import { Vercel } from "@vercel/sdk";
import path from "path";
import { fileURLToPath } from "url";
import { BASE_URL, FRONT_URL,isDevelopment } from "./utils/utils.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import crypto from "crypto";
// Utiliser require pour les environnements CommonJS (si nécessaire), sinon garder import
// Remplacer les imports par des require est complexe avec le code fourni,
// nous allons conserver la syntaxe ESM (import/export) standard pour Node.js moderne.
import avis from "./avis/avis.js";
import contact from "./contact/contact.js";

import { genererCV,monProfil } from "./services/groq/groq.js";
//import {messages} from "./messages/messages.js";




dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET est requis pour le serveur.");
}

// Utiliser cors et bodyparser
app.use(cors());
app.use(bodyParser.json());

// --- GESTION DE LA SESSION DE CHAT GLOBALE ---
let chatSession: null = null;

type MagicLinkData = {
  email: string;
  expires: number;
  used: boolean;
};

const magicStore = new Map<string, MagicLinkData>();

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
  } catch (error : any) {
    console.error(error);

    res.status(500).json({ error: error.message });
  }
});
// Fonction pour générer une réponse du modèle
const getResponseProfil = async (message: string) => {
  // Si aucune session n'existe, nous devons la créer pour démarrer le Tour 1
  try {
    const responseProfil = await monProfil();
   return responseProfil;
    
  } catch (error : any) {
   
    //declencher une erreur critique qui réinitialise la session
    throw new Error("Erreur lors de la génération de la réponse du projet : " + error.message);
  }
};
app.get("/auth/login", (req, res) => {
  const tokenQuery = req.query.token;
  const emailQuery = req.query.email;
  const token = Array.isArray(tokenQuery) ? tokenQuery[0] : tokenQuery;
  const email = Array.isArray(emailQuery) ? emailQuery[0] : emailQuery;

  if (typeof token !== "string" || typeof email !== "string") {
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
  const jwtToken = jwt.sign({ email }, JWT_SECRET, {
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
      "compétences",
      "profil"
    ];
    
    const { message } = req.body; // --- Logique existante du CV ---
   
    //const remainRequestsValue=await remainRequests();
    if (message.includes("cv") || message.includes("CV") || message.includes("curriculum vitae") || message.includes("Curriculum Vitae")) {
      // ... (Logique CV inchangée)
      const CV = genererCV();
      const result = await CV;
      //display CV in new tab
      const fileName= result.name;
      const fileUrl = `${BASE_URL}/${fileName}`;
      
      res.json({
        response: fileUrl,
      });


    }else if(enums.some(enumItem => message.includes(enumItem))){
      const profil = monProfil();
      const result = await profil;
  
      res.json({
        response: result.choices[0].message.content,
        
      });
    }
    // --- Logique PROJET/LOGIN (Conversation Multi-tours) ---
    //message ne doit pas etre vide
    else if ( message || chatSession) {
      // Le chat commence avec "projet" OU continue si une session existe
    
      const projetResponse = await getResponseProfil(message);
     
      res.json({ response: projetResponse.choices[0].message.content }); 
    } else {
      // Message non pertinent et pas de session active
      res.json({
        response:
          "Je suis désolé, je ne peux répondre qu'aux questions sur mon CV ou le projet Taekna.",
       
      });
    }
  } catch (error: any) {
    console.error("Erreur Gemini/Vercel:", error); // Réinitialiser la session en cas d'erreur critique
    chatSession = null;
    res.status(500).json({ error: true, response: error.message });
  }
});

app.use("/avis", avis);
app.use("/contact", contact);
//app.use("/messages",messages);
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
