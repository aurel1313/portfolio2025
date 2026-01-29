import { Router } from "express";
import { pool } from "../db.js";
import xss from "xss";
import { Resend } from "resend";
const router = Router();
router.post("/", async (req, res) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { name, email, message } = req.body;
    const sanitizedName = xss(name);
    const sanitizedEmail = xss(email);
    const sanitizedMessage = xss(message);
    //nettoyage des inputs pour eviter les attaques xss
    //send email to admin with contact form details
    (async function () {
      const { data, error } = await resend.emails.send({
        from: "Portfolio <onboarding@resend.dev>",
        to: ["aurelienfabre439@gmail.com"],
        subject: `${sanitizedName} nous a contacté`,
        html: `
        <p>Vous avez reçu un nouveau message de contact :</p>
               <p><strong>Nom :</strong> ${sanitizedName}</p>
               <p><strong>Email :</strong> ${sanitizedEmail}</p>
                <p><strong>Message :</strong> ${sanitizedMessage}</p>
        `,
      });
      if (error) {
        return console.error({ error });
      }

      console.log({ data });
    })();
 
    res.status(200).json({
      success: true,
      message: "Message envoyé avec succès.",
    });
  } catch (error) {
    // 2. Affichage dans la console pour vous (le développeur)
    console.error("Erreur serveur :", error);
    // 3. Réponse générique pour l'utilisateur en cas d'autre crash
    res.status(500).json({
      success: false,
      messageFailed: "Une erreur serveur est survenue.",
    });
  }
});
export default router;
