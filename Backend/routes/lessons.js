import express from "express";
import { getDB } from "../db.js";
import { ObjectId } from "mongodb"; 

const router = express.Router();

//funstion to get all lessons
export async function getAllLessons() {
  const db = getDB();
  return await db.collection("lessons").find({}).toArray();
}
//GET /lessons
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const lessons = await db.collection("lessons").find({}).toArray();

    res.json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cannot fetch lessons" });
  }
});
// PUT /lessons/:id  → update any lesson attribute (especially space)
router.put("/:id", async (req, res) => {
  try {
    const db = getDB();
    const lessonId = req.params.id;

    const updateData = req.body;

    const result = await db.collection("lessons").updateOne(
      { _id: new ObjectId(lessonId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Lesson not found" });

    res.json({ message: "Lesson updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update lesson" });
  }
});



export default router;

