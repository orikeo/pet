import express from "express";
import { authMiddleware } from "./auth/auth.middleware";
import { db } from "./db";
import { users } from "./db/schema";
import bcrypt from "bcrypt";

import userRoutes from "./routes/user.routes";
import authRoutes from "./auth/auth.routes";



const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

export default app;