import express from "express";

const router = express.Router();

// 🔹 Hardcoded categories (Replace with a database call if needed)
const categories = [
  "Αντλίες Σκαφών",
  "Υποβρύχιος Φωτισμός",
  "Όργανα Ελέγχου",
  "Υαλοκαθαριστήρες Σκαφών",
  "Συστήματα Πλοήγησης",
  "Alternator Regulator",
  "Έξυπνο Σύστημα Πρόληψης Συγκρούσεων",
  "Συστήματα Ελέγχου",
  "Ηλεκτρολογικό Υλικό Σκαφών",
  "Ηλεκτρικός Εξοπλισμός",
  "Φορτιστές Μπαταριών",
  "Συστήματα Αυτοματισμού",
  "Marine Generator",
];

// 🔹 API route: GET `/api/categories` (Returns a list of categories)
router.get("/", (req, res) => {
  res.json(categories);
});

export default router;
