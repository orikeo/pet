import { Router } from "express";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/notes.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createNote);
router.get("/", getNotes);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;