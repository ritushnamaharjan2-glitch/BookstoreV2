import express from "express";
import { getDB } from "../db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// POST /orders → save new order
router.post("/", async (req, res) => {
  const { name, phone, lessonIDs, spaces } = req.body;

  if (!name || !phone || !lessonIDs || !spaces) {
    return res.status(400).json({ message: "Missing order fields" });
  }

  try {
    const db = getDB();

    // Save order
    await db.collection("orders").insertOne({
      name,
      phone,
      lessonIDs,
      spaces,
      createdAt: new Date()
    });

    // Decrease space for each lesson
    for (let i = 0; i < lessonIDs.length; i++) {
      await db.collection("lessons").updateOne(
        { _id: new ObjectId(lessonIDs[i]) },
        { $inc: { space: -1 } }
      );
    }

    res.json({ message: "Order saved + spaces updated!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save order" });
  }
});

export default router;
