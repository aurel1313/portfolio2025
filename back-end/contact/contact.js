import { Router } from "express";
import { pool } from "../db.js";
import xss from "xss";
const router = Router();
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const sanitizedName = xss(name);
    const sanitizedEmail = xss(email);
    const sanitizedMessage = xss(message);
    //nettoyage des inputs pour eviter les attaques xss
    //send email to admin with contact form details
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASS2, // generated ethereal password
      },
    });
    const mailOptions = {
      from: `portfolio2025af@gmail.com`,
      to: "aurelienfabre439@gmail.com",
      subject: "Nouveau message de contact",
      html: `<p>Vous avez reçu un nouveau message de contact :</p>
               <p><strong>Nom :</strong> ${sanitizedName}</p>
               <p><strong>Email :</strong> ${sanitizedEmail}</p>
                <p><strong>Message :</strong> ${sanitizedMessage}</p>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
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
