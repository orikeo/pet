import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../db";
import { users } from "../db/schema";

export async function getUsers(req: Request, res: Response) {
  const allUsers = await db.select().from(users);
  res.json(allUsers);
}

export async function createUser(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password required" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning();

  res.status(201).json(result[0]);
}