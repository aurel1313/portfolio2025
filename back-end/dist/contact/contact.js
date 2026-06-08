import { Router } from "express";
import { pool } from "../db.js";
import xss from "xss";
import { Resend } from "resend";
import { sendEmail } from "../services/mail/mail.js";
const router = Router();
router.post("/", async (req, res) => {
    try {
        //const resend = new Resend(process.env.RESEND_API_KEY);
        const { name, email, message } = req.body;
        const sanitizedName = xss(name);
        const sanitizedEmail = xss(email);
        const sanitizedMessage = xss(message);
        await sendEmail("aurelienfabre439@gmail.com", `${sanitizedName} nous a contacté`, sanitizedMessage);
        res.status(200).json({
            success: true,
            message: "Message envoyé avec succès.",
        });
    }
    catch (error) {
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
