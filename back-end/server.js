import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { Vercel } from "@vercel/sdk";
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.post("/gemini", async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.API_GEMINI;

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const parcours = `Voici le parcours professionnel d'Aurélien Fabre :
    - Développeur FullStack chez Monlook : développement Prestashop, Symfony, React
    - Développeur chez Digital Associates : refonte graphique, simulateur budget en React
    - Side projects en Next.js
    - 3 ans d'expérience en développement web
    - Formation Bac+4 Conception et Développement d’Applications
    - Actuellement en formation DWWM à l'AFPA`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });
    //si le message ne contient pas le mot "CV" repondre "Je suis désolé, je ne peux pas vous aider avec cela."
    if (
      !message.includes("CV") ||
      !message.includes("parcours") ||
      !message.includes("experience")
    ) {
      if (message.includes("parcours")) {
        return res.json({ response: parcours });
      }
      const result =  ai.chats.create({
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
            
            Lien du CV : http://localhost:${PORT}/cv-aurelien-fabre.pdf
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
    const response1 = await result.sendMessage({
        message: message,
    });
    if (response1) {
      return res.json({ response: response1.text });
    } else {
      return res.json({
        response: "Je suis désolé, je ne peux pas vous aider avec cela.",
      });
    }
     
    } else {
      return res.json({
        response: "Je suis désolé, je ne peux pas vous aider avec cela.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
const vercel  = new Vercel({
  bearerToken: process.env.VERCEL_API,
});
app.get("/projetStage",async (req, res) => {
  const url = 'https://api.vercel.com/v9/projects/taekna';
  try {
   
   
    const response = await fetch(url, {
      method: 'GET',
      headers:{
        Authorization: `Bearer ${process.env.VERCEL_API}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
