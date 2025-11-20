import express from "express";
import { Router } from "express";
import { pool } from "../db.js";
const router = Router();

router.post("/", async (req, res) => {
  try {
    const { comment, email } = req.body;
    await pool.query("INSERT INTO avis (avis, email) VALUES ($1, $2)", [
      comment,
      email,
    ]);

    console.log("Nouveau avis reçu :", { comment, email });
    res.status(200).json({ messageSuccess: "Avis reçu avec succès" });
  } catch (error) {
    if (error.code === "23505") {
      // Code PostgreSQL pour "unique_violation"
      // On retourne ici pour ne pas exécuter le code du dessous
      return res.status(400).json({
        success: false,
        messageFailed: "Cette adresse email a déjà posté un avis.",
      });
    }

    // 2. Affichage dans la console pour vous (le développeur)
    console.error("Erreur serveur :", error);

    // 3. Réponse générique pour l'utilisateur en cas d'autre crash
    res.status(500).json({
      success: false,
      messageFailed: "Une erreur serveur est survenue.",
    });
  }
});
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM avis");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des avis :", error);
    // 1. On vérifie D'ABORD si c'est une erreur de clé dupliquée (code 23505)
   

    // 2. SINON, on envoie l'erreur générique (500)
    res.status(500).json({
      messageFailed: "Une erreur serveur est survenue.",
    });
  }
});
export default router;
