import express from "express";
import { getDB } from "../db.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const db = getDB();
  const users = db.collection("users");

  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const exists = await users.findOne({ $or: [{ email }, { username }] });

  if (exists) return res.status(400).json({ message: "User already exists" });

  await users.insertOne({ username, email, password });
  res.json({ message: "Registration successful" });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const db = getDB();
  const user = await db.collection("users").findOne({
    $or: [{ email }, { username: email }],
    password
  });

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    username: user.username,
    email: user.email
  });
});

export default router;
