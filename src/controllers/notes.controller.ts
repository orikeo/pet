import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { notes } from "../db/schema";

// POST /notes
export async function createNote(req: Request, res: Response) {
  const { title, content } = req.body;
  const user = req.user!;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content required" });
  }

  const [note] = await db
    .insert(notes)
    .values({
      title,
      content,
      userId: user.id,
    })
    .returning();

  res.status(201).json(note);
}

// GET /notes
export async function getNotes(req: Request, res: Response) {
  const user = req.user!;

  if (user.role === "admin") {
    const all = await db.select().from(notes);
    return res.json(all);
  }

  const userNotes = await db
    .select()
    .from(notes)
    .where(eq(notes.userId, user.id));

  res.json(userNotes);
}

// GET /notes/:id
export async function getNoteById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = req.user!;

  const note = await db.query.notes.findFirst({
    where: eq(notes.id, id),
  });

  if (!note) return res.status(404).json({ message: "Not found" });

  if (user.role !== "admin" && note.userId !== user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.json(note);
}

// PUT /notes/:id
export async function updateNote(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = req.user!;
  const { title, content } = req.body;

  const note = await db.query.notes.findFirst({
    where: eq(notes.id, id),
  });

  if (!note) return res.status(404).json({ message: "Not found" });

  if (user.role !== "admin" && note.userId !== user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const [updated] = await db
    .update(notes)
    .set({ title, content })
    .where(eq(notes.id, id))
    .returning();

  res.json(updated);
}

// DELETE /notes/:id
export async function deleteNote(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = req.user!;

  const note = await db.query.notes.findFirst({
    where: eq(notes.id, id),
  });

  if (!note) return res.status(404).json({ message: "Not found" });

  if (user.role !== "admin" && note.userId !== user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await db.delete(notes).where(eq(notes.id, id));
  res.status(204).send();
}