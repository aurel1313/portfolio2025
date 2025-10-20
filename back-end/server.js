import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { Vercel } from "@vercel/sdk";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const apiKey = process.env.API_GEMINI;
const files = fileURLToPath(import.meta.url);
const dir= path.dirname(files);
const ai = new GoogleGenAI({ apiKey: apiKey });
app.get('/cv', (req, res) => {
 const filePath = path.join(dir, "public", "CVDevFullstackAurelienFabre.pdf");
  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).send('Error downloading file');
    }
  });
});
app.post("/gemini", async (req, res) => {
  try {
    const { message } = req.body;

    const parcours = `Voici le parcours professionnel d'Aurélien Fabre :
    - Développeur FullStack chez Monlook : développement Prestashop, Symfony, React
    - Développeur chez Digital Associates : refonte graphique, simulateur budget en React
    - Side projects en Next.js
    - 3 ans d'expérience en développement web
    - Formation Bac+4 Conception et Développement d’Applications
    - Actuellement en formation DWWM à l'AFPA`;

    const loginProjectVercel = `Le login du projet Vercel est : taekna`;

    //si le message ne contient pas le mot "CV" repondre "Je suis désolé, je ne peux pas vous aider avec cela."
    if (message.includes("projet")) {
      // Nous devons obtenir le résultat de ce Chat.
      const chatResponse = await askLoginForConnectProject(loginProjectVercel,message);
      //envoi les data par mail a la personne
       const asnswer = chatResponse.sendMessage({
        message: message,
      });
      console.log((await asnswer).text)
      return res.json({
        response: asnswer.text,
      });
    }

    const systemInstructions = ai.chats.create({
      model: "gemini-2.5-flash",
      history: [
        {
          role: "model",
          parts: [
            {
              text: `
            Tu es un assistant qui connaît uniquement le CV d'Aurélien Fabre.
            Si l'utilisateur demande son CV, réponds toujours par :
            "Voici le CV d'Aurélien Fabre : [LIEN_CV]".
            
            Si la question ne concerne pas le CV → dis simplement que tu ne peux répondre qu'au sujet du CV.
            
            Lien du CV : http://localhost:${PORT}/cv
            `,
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });
    const projet = askLoginForConnectProject(loginProjectVercel);
    const result = await systemInstructions.sendMessage({
      message: message,
    });

    return res.json({ response: result.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
const vercel = new Vercel({
  bearerToken: process.env.VERCEL_API,
});
const isEmail = (str) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
}
const url = "https://api.vercel.com/v9/projects/taekna";
const askLoginForConnectProject = async (login,message) => {
  try {
    // questionner le bot pour demander le login du projet
    const response = ai.chats.create({
      model: "gemini-2.5-flash",
      history: [
        {
          role: "user",
          parts: [
            { text: `Quel est le login pour se connecter au projet Vercel ?` },
          ],
        },
        {
          role: "model",
          parts: [{ text: `saissisez votre mail pour que je vous envoie les acces` }],
        },
        {
          role: "user",
          parts: [{ text: `
            mon mail est : ${isEmail(message) ? message : "email invalide, veuillez fournir un email correct."}
          ` }],
        },
        {
          role: "model",
          parts: [{ text: `Le login du projet Vercel est : ${login}` }],
        },
      ],
    });
    
    return response;

  
  } catch (error) {
    console.error("Error asking for login:", error);
  }
};

app.get("/projetStage", async (req, res) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_API}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
// questionner le bot sur mon projet : pour demande de login du projet envoyer les infos par mail a la personne(le bot doit demander le mail)
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
