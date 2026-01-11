import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

const accessSecret: Secret = env.JWT_ACCESS_SECRET;
const refreshSecret: Secret = env.JWT_REFRESH_SECRET;

const accessExpiresIn = env.JWT_ACCESS_TTL as SignOptions["expiresIn"];
const refreshExpiresIn = env.JWT_REFRESH_TTL as SignOptions["expiresIn"];

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, accessSecret, {
    expiresIn: accessExpiresIn,
  });
}

export function signRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, refreshSecret, {
    expiresIn: refreshExpiresIn,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, accessSecret) as JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, refreshSecret) as JwtPayload;
}