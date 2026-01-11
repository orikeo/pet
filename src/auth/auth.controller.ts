import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "../db";
import { users, refreshTokens } from "../db/schema";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "./jwt";

/**
 * POST /auth/login
 */
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = {
  id: user.id,
  email: user.email,
  role: user.role,
};

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await db.insert(refreshTokens).values({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
  });

  return res.json({
    accessToken,
    refreshToken,
  });
}

/**
 * POST /auth/refresh
 */
export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  const tokenInDb = await db.query.refreshTokens.findFirst({
    where: eq(refreshTokens.token, refreshToken),
  });

  if (!tokenInDb) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    return res.status(401).json({ message: "Refresh token expired" });
  }

  const newAccessToken = signAccessToken({
  id: payload.id,
  email: payload.email,
  role: payload.role,
});

  return res.json({ accessToken: newAccessToken });
}