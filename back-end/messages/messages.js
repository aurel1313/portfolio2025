import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur la route des messages!" });
});