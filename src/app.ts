import express from "express";
import { authMiddleware } from "./auth/auth.middleware";
import cors from "cors";

import userRoutes from "./routes/user.routes";
import authRoutes from "./auth/auth.routes";
import notesRoutes from "./routes/notes.routes";



const app = express();

app.use(cors({
  origin: "http://localhost:5174",
  credentials: true,
}));
app.use(express.json());


app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);

export default app;